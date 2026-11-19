import QRCode from 'qrcode';
import crypto from 'crypto';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { sendSmsOtp, normalizePhone } from '../utils/otpService.js';
import { sendEmailNotification } from '../utils/mailer.js';
import {
  createCashfreeOrderService,
  fetchCashfreeOrderService,
  fetchCashfreeOrderPaymentsService,
  verifyCashfreeWebhookSignature,
  getCashfreeConfig,
} from '../utils/cashfreeService.js';

/**
 * Get Cashfree Configuration Status (public for frontend SDK setup)
 * GET /api/payment/cashfree/config
 */
export const getCashfreePublicConfig = async (req, res, next) => {
  try {
    const config = getCashfreeConfig();
    res.status(200).json(
      new ApiResponse(
        200,
        {
          env: config.env,
          isConfigured: config.isConfigured,
        },
        'Cashfree configuration status'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a Cashfree Payment Session for an order
 * POST /api/payment/cashfree/create-order
 */
export const createCashfreeOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError(400, 'Order ID is required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const returnUrl = `${clientUrl}/order-success/${encodeURIComponent(order.orderNumber)}?cf_order_id={order_id}`;
    const notifyUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/cashfree/webhook`;

    // Business logic executed via cashfreeService in utils
    const cfOrder = await createCashfreeOrderService({
      orderId: order.orderNumber,
      orderAmount: order.totalAmount,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: req.user?._id ? String(req.user._id) : `cust_${order._id}`,
        name: order.customerDetails?.name || 'Customer',
        email: order.customerDetails?.email || 'orders@weddingwishcraft.in',
        phone: order.customerDetails?.phone || '',
      },
      returnUrl,
      notifyUrl,
    });

    // Create or update pending Payment record in DB
    let payment = await Payment.findOne({ order: order._id, method: 'Cashfree' });
    if (payment) {
      payment.amount = order.totalAmount;
      payment.status = 'pending';
      payment.transactionId = cfOrder.cf_order_id ? String(cfOrder.cf_order_id) : cfOrder.order_id;
      await payment.save();
    } else {
      payment = await Payment.create({
        order: order._id,
        user: req.user?._id || order.user || null,
        amount: order.totalAmount,
        currency: 'INR',
        method: 'Cashfree',
        status: 'pending',
        transactionId: cfOrder.cf_order_id ? String(cfOrder.cf_order_id) : cfOrder.order_id,
        customerDetails: order.customerDetails,
        notes: `Cashfree payment session created: ${cfOrder.payment_session_id}`,
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          paymentSessionId: cfOrder.payment_session_id,
          orderId: cfOrder.order_id,
          cfOrderId: cfOrder.cf_order_id,
          orderExpiryTime: cfOrder.order_expiry_time,
          orderAmount: order.totalAmount,
          orderNumber: order.orderNumber,
          paymentId: payment._id,
        },
        'Cashfree payment session created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Cashfree Payment status
 * POST /api/payment/cashfree/verify
 */
export const verifyCashfreePayment = async (req, res, next) => {
  try {
    const { orderId, cfOrderId } = req.body;
    const lookupId = cfOrderId || orderId;

    if (!lookupId) {
      throw new ApiError(400, 'Order ID or Cashfree Order ID is required');
    }

    // Call Cashfree API to verify the genuine status
    const cfOrder = await fetchCashfreeOrderService(lookupId);

    // Find the order in our database
    const order = await Order.findOne({
      $or: [
        { orderNumber: cfOrder.order_id },
        { _id: req.body.dbOrderId || null },
      ],
    });

    if (!order) {
      throw new ApiError(404, 'Associated order not found in database');
    }

    const isPaid = cfOrder.order_status === 'PAID';

    // Find payment record
    let payment = await Payment.findOne({ order: order._id, method: 'Cashfree' }).sort({ createdAt: -1 });

    if (isPaid) {
      order.paymentStatus = 'paid';
      order.paymentMethod = 'Cashfree';
      if (order.orderStatus === 'Order Placed') {
        order.orderStatus = 'In Production';
        order.statusHistory.push({
          status: 'In Production',
          note: `Payment of ₹${order.totalAmount} verified successfully via Cashfree.`,
          timestamp: new Date(),
        });
      }
      await order.save();

      if (payment) {
        payment.status = 'paid';
        payment.paidAt = new Date();
        payment.transactionId = String(cfOrder.cf_order_id || cfOrder.order_id);
        await payment.save();
      }

      // Send SMS confirmation
      const customerPhone = order.customerDetails?.phone;
      if (customerPhone) {
        const normalized = normalizePhone(customerPhone);
        await sendSmsOtp({
          phone: normalized,
          otp: order.orderNumber,
          purpose: 'payment_confirmation',
        }).catch((err) => console.error('SMS notification error:', err));
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            verified: true,
            status: 'paid',
            orderNumber: order.orderNumber,
            cfOrder,
          },
          'Payment verified successfully'
        )
      );
    } else {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            verified: false,
            status: cfOrder.order_status,
            orderNumber: order.orderNumber,
            cfOrder,
          },
          `Payment not yet completed: current status is ${cfOrder.order_status}`
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Cashfree Server-to-Server Webhook
 * POST /api/payment/cashfree/webhook
 */
export const handleCashfreeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // Verify webhook authenticity
    if (signature && timestamp) {
      const isValid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        return res.status(400).json(new ApiResponse(400, null, 'Invalid webhook signature'));
      }
    }

    const event = req.body;
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;

    if (orderData?.order_id) {
      const order = await Order.findOne({ orderNumber: orderData.order_id });
      if (order && (paymentData?.payment_status === 'SUCCESS' || orderData.order_status === 'PAID')) {
        order.paymentStatus = 'paid';
        order.paymentMethod = 'Cashfree';
        if (order.orderStatus === 'Order Placed') {
          order.orderStatus = 'In Production';
          order.statusHistory.push({
            status: 'In Production',
            note: 'Payment captured via Cashfree webhook.',
            timestamp: new Date(),
          });
        }
        await order.save();

        await Payment.findOneAndUpdate(
          { order: order._id },
          {
            status: 'paid',
            paidAt: new Date(),
            transactionId: paymentData?.cf_payment_id ? String(paymentData.cf_payment_id) : String(orderData.cf_order_id),
            method: 'Cashfree',
          },
          { new: true }
        );
      }
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(200).json({ status: 'ERROR_LOGGED' });
  }
};

/**
 * Generate UPI payment QR code with the exact order amount
 * POST /api/payment/upi/generate-qr
 */
export const generateUpiQr = async (req, res, next) => {
  try {
    const { orderId, amount, customerName } = req.body;

    if (!orderId || !amount) {
      throw new ApiError(400, 'Order ID and amount are required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Use configured UPI ID or default
    const upiId = process.env.UPI_ID || 'shivamthakur.shivi-5@okaxis';
    const payeeName = process.env.UPI_PAYEE_NAME || 'Shivam Thakur';
    const transactionRef = `WW${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const amountFixed = Number(amount).toFixed(2);

    // Build UPI deep link URI (works with GPay, PhonePe, Paytm, BHIM etc.)
    const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amountFixed}&cu=INR&tn=${encodeURIComponent(`Wedding Wishcraft Order ${order.orderNumber}`)}&tr=${transactionRef}`;

    // Generate QR code as base64 data URL
    const qrDataUrl = await QRCode.toDataURL(upiUri, {
      width: 400,
      margin: 2,
      color: {
        dark: '#3A0A1E',  // Maroon (brand color)
        light: '#FFF8F0', // Cream (brand background)
      },
      errorCorrectionLevel: 'H',
    });

    // Create a payment record in pending state
    const payment = await Payment.create({
      order: order._id,
      user: req.user?._id || null,
      amount: Number(amount),
      currency: 'INR',
      method: 'UPI',
      status: 'pending',
      transactionId: transactionRef,
      qrDataUrl,
      customerDetails: {
        name: customerName || order.customerDetails?.name || '',
        email: order.customerDetails?.email || '',
        phone: order.customerDetails?.phone || '',
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          qrDataUrl,
          customQrImage: '/upi-qr.jpg',
          upiUri,
          upiId,
          payeeName,
          amount: amountFixed,
          transactionRef,
          paymentId: payment._id,
          orderNumber: order.orderNumber,
        },
        'UPI QR code generated successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm UPI payment by customer
 * Marks payment as 'paid' and order as 'In Production'
 * POST /api/payment/upi/confirm
 */
export const confirmUpiPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId, upiTransactionRef } = req.body;

    if (!orderId) {
      throw new ApiError(400, 'Order ID is required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const cleanUtr = (upiTransactionRef && typeof upiTransactionRef === 'string' && upiTransactionRef.trim().length >= 4)
      ? upiTransactionRef.trim().toUpperCase()
      : `UPI_${Date.now()}`;

    // Locate or update payment record
    let payment;
    if (paymentId) {
      payment = await Payment.findById(paymentId);
    }
    if (!payment) {
      payment = await Payment.findOne({
        order: orderId,
      }).sort({ createdAt: -1 });
    }

    if (payment) {
      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.upiTransactionRef = cleanUtr;
      payment.notes = 'Payment completed by customer via UPI QR';
      await payment.save();
    } else {
      // Create if none existed
      payment = await Payment.create({
        order: order._id,
        user: req.user?._id || order.user || null,
        amount: order.totalAmount,
        currency: 'INR',
        method: 'UPI',
        status: 'paid',
        paidAt: new Date(),
        upiTransactionRef: cleanUtr,
        transactionId: cleanUtr,
        customerDetails: order.customerDetails,
        notes: 'Payment completed by customer via UPI QR',
      });
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.paymentMethod = 'UPI';
    order.orderStatus = 'In Production';
    order.statusHistory.push({
      status: 'In Production',
      note: `Payment of ₹${order.totalAmount} completed via UPI. Video queued for motion design.`,
      timestamp: new Date(),
    });
    await order.save();

    // Send SMS notification: Payment successful!
    const customerPhone = order.customerDetails?.phone;
    if (customerPhone) {
      const normalized = normalizePhone(customerPhone);
      await sendSmsOtp({
        phone: normalized,
        otp: order.orderNumber,
        purpose: 'payment_confirmation',
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          success: true,
          orderNumber: order.orderNumber,
          paymentStatus: 'paid',
          orderStatus: 'In Production',
          upiTransactionRef: cleanUtr,
          amount: order.totalAmount,
        },
        'Payment completed successfully! Confirmation SMS dispatched.'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all UPI payments awaiting admin verification
 * GET /api/payment/admin/pending
 */
export const getPendingVerifications = async (req, res, next) => {
  try {
    const payments = await Payment.find({
      status: 'pending_verification',
    })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber orderStatus totalAmount customerDetails items createdAt');

    res.status(200).json(
      new ApiResponse(
        200,
        payments,
        `Retrieved ${payments.length} pending UPI verifications`
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Admin action to approve or reject a UPI payment
 * PATCH /api/payment/admin/verify
 */
export const verifyUpiPaymentByAdmin = async (req, res, next) => {
  try {
    const { paymentId, action, adminNote } = req.body;

    if (!paymentId || !['approve', 'reject'].includes(action)) {
      throw new ApiError(400, 'Payment ID and valid action (approve or reject) are required');
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }

    const order = await Order.findById(payment.order);
    if (!order) {
      throw new ApiError(404, 'Associated order not found');
    }

    if (action === 'approve') {
      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.verifiedAt = new Date();
      payment.verifiedBy = req.user?._id || null;
      payment.notes = adminNote || `Approved by ${req.user?.name || 'Admin'}`;
      await payment.save();

      order.paymentStatus = 'paid';
      order.orderStatus = 'In Production';
      order.statusHistory.push({
        status: 'In Production',
        note: `Payment of ₹${payment.amount} verified by studio (UTR: ${payment.upiTransactionRef}). Video in active production.`,
        timestamp: new Date(),
      });
      await order.save();

      // Dispatch confirmation SMS
      const customerPhone = order.customerDetails?.phone;
      if (customerPhone) {
        const normalized = normalizePhone(customerPhone);
        await sendSmsOtp({
          phone: normalized,
          otp: order.orderNumber,
          purpose: 'payment_confirmation',
        });
      }

      // Send confirmation Email
      if (order.customerDetails?.email) {
        sendEmailNotification({
          to: order.customerDetails.email,
          subject: `💍 Payment Verified! Order ${order.orderNumber} is Now in Production - Wedding Wishcraft`,
          html: `
            <h2>Payment Verified Successfully!</h2>
            <p>Dear ${order.customerDetails.name},</p>
            <p>We have successfully verified your payment of <strong>₹${payment.amount?.toLocaleString('en-IN')}</strong> (UTR: ${payment.upiTransactionRef}).</p>
            <p>Your order <strong>${order.orderNumber}</strong> has moved to <strong>In Production</strong>.</p>
            <p>Our senior motion artists are rendering your bespoke 4K wedding invitation. Expect your preview within 24 hours!</p>
          `,
        });
      }

      res.status(200).json(
        new ApiResponse(
          200,
          { payment, order },
          'Payment approved successfully! Order moved to In Production and customer notified.'
        )
      );
    } else {
      // Reject action
      payment.status = 'failed';
      payment.notes = adminNote || 'UTR verification failed. Bank credit not found.';
      await payment.save();

      order.paymentStatus = 'failed';
      order.statusHistory.push({
        status: 'Payment Verification',
        note: `Payment verification rejected: ${adminNote || 'UTR not received in bank account.'}`,
        timestamp: new Date(),
      });
      await order.save();

      // Send rejection Email if email available
      if (order.customerDetails?.email) {
        sendEmailNotification({
          to: order.customerDetails.email,
          subject: `⚠️ Notice regarding Payment for Order ${order.orderNumber} - Wedding Wishcraft`,
          html: `
            <h2>Payment Verification Notice</h2>
            <p>Dear ${order.customerDetails.name},</p>
            <p>We were unable to verify your UPI transaction with reference <strong>${payment.upiTransactionRef}</strong> for order <strong>${order.orderNumber}</strong>.</p>
            <p><strong>Reason:</strong> ${adminNote || 'Payment not reflected in our merchant account'}.</p>
            <p>Please contact our WhatsApp atelier or re-submit the correct transaction reference.</p>
          `,
        });
      }

      res.status(200).json(
        new ApiResponse(
          200,
          { payment, order },
          'Payment rejected. Customer order status updated.'
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment history for a logged-in user
 * GET /api/payment/history
 */
export const getPaymentHistory = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      throw new ApiError(401, 'Please sign in to view payment history');
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('order', 'orderNumber orderStatus totalAmount items createdAt'),
      Payment.countDocuments({ user: req.user._id }),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          payments,
          pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
          },
        },
        'Payment history fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment details for a specific order
 * GET /api/payment/order/:orderId
 */
export const getPaymentByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ order: orderId })
      .sort({ createdAt: -1 })
      .populate('order', 'orderNumber orderStatus totalAmount customerDetails');

    if (!payment) {
      throw new ApiError(404, 'No payment record found for this order');
    }

    res.status(200).json(
      new ApiResponse(200, payment, 'Payment details retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy Razorpay order creation (kept for backward compatibility)
 * POST /api/payment/razorpay/order
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_weddingwishcraft_demo';
    const razorpayOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { razorpayOrderId });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          key: rzpKeyId,
          amount: amount * 100,
          currency: 'INR',
          order_id: razorpayOrderId,
          name: 'Wedding Wishcraft',
          description: 'Payment for Bespoke Wedding Invitation Video',
        },
        'Payment order initiated'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy Razorpay payment verification (kept for backward compatibility)
 * POST /api/payment/razorpay/verify
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature) {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json(new ApiResponse(400, null, 'Payment verification failed: Invalid signature'));
      }
    }

    if (orderId) {
      const order = await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
      }, { new: true });

      // Create payment record for Razorpay too
      if (order) {
        await Payment.create({
          order: order._id,
          user: order.user || null,
          amount: order.totalAmount,
          currency: 'INR',
          method: 'Razorpay',
          status: 'paid',
          transactionId: razorpay_payment_id || `pay_${Date.now()}`,
          paidAt: new Date(),
          customerDetails: order.customerDetails,
        });

        // Send SMS confirmation
        const customerPhone = order.customerDetails?.phone;
        if (customerPhone) {
          const normalized = normalizePhone(customerPhone);
          await sendSmsOtp({
            phone: normalized,
            otp: order.orderNumber,
            purpose: 'payment_confirmation',
          });
        }
      }
    }

    res.status(200).json(new ApiResponse(200, { success: true }, 'Payment verified successfully'));
  } catch (error) {
    next(error);
  }
};
