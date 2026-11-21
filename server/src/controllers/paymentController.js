import QRCode from 'qrcode';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { sendSmsOtp, normalizePhone } from '../utils/otpService.js';
import { sendEmailNotification } from '../utils/mailer.js';
import {
  createRazorpayOrderService,
  verifyRazorpaySignature,
  fetchRazorpayPayment,
  verifyWebhookSignature,
} from '../utils/razorpayService.js';

// ================================================================
// RAZORPAY PAYMENT GATEWAY
// ================================================================

/**
 * Get Razorpay public configuration for frontend SDK
 * GET /api/payment/razorpay/config
 * NEVER expose the secret key
 */
export const getRazorpayPublicConfig = async (req, res, next) => {
  try {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          keyId: process.env.RAZORPAY_KEY_ID,
          currency: 'INR',
        },
        'Razorpay public configuration'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a Razorpay Order for an existing DB order
 * POST /api/payment/razorpay/create-order
 * Body: { orderId }
 * NEVER trusts frontend amount — uses server-calculated totalAmount
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw new ApiError(400, 'Order ID is required');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Create Razorpay order using server-calculated amount
    const rzpOrder = await createRazorpayOrderService({
      amount: order.totalAmount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        dbOrderId: String(order._id),
        orderNumber: order.orderNumber,
        customerName: order.customerDetails?.name || '',
      },
    });

    // Store razorpayOrderId on the Order document
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    // Create or update pending Payment record
    let payment = await Payment.findOne({ order: order._id, method: 'Razorpay' });
    if (payment) {
      payment.amount = order.totalAmount;
      payment.status = 'pending';
      payment.razorpayOrderId = rzpOrder.id;
      payment.transactionId = rzpOrder.id;
      await payment.save();
    } else {
      payment = await Payment.create({
        order: order._id,
        user: req.user?._id || order.user || null,
        amount: order.totalAmount,
        currency: 'INR',
        method: 'Razorpay',
        status: 'pending',
        razorpayOrderId: rzpOrder.id,
        transactionId: rzpOrder.id,
        customerDetails: order.customerDetails,
        notes: `Razorpay order created: ${rzpOrder.id}`,
      });
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: String(order._id),
          razorpayOrderId: rzpOrder.id,
          amount: rzpOrder.amount, // Amount in paise (matches Razorpay order)
          amountInRupees: order.totalAmount,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID,
          orderNumber: order.orderNumber,
          paymentId: payment._id,
        },
        'Razorpay order created successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay Payment after checkout
 * POST /api/payment/razorpay/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required');
    }

    // Step 1: Verify signature
    const isValidSignature = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidSignature) {
      throw new ApiError(400, 'Payment verification failed: Invalid signature');
    }

    // Step 2: Fetch payment from Razorpay API to double-check status
    const rzpPayment = await fetchRazorpayPayment(razorpay_payment_id);

    if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
      throw new ApiError(400, `Payment not successful. Current status: ${rzpPayment.status}`);
    }

    // Step 3: Find order by razorpayOrderId
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      throw new ApiError(404, 'Associated order not found in database');
    }

    // Step 4: Prevent duplicate processing
    if (order.paymentStatus === 'paid') {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            verified: true,
            status: 'paid',
            orderNumber: order.orderNumber,
            alreadyProcessed: true,
          },
          'Payment was already verified'
        )
      );
    }

    // Step 5: Update Order
    order.paymentStatus = 'paid';
    order.paymentMethod = 'Razorpay';
    order.razorpayPaymentId = razorpay_payment_id;
    if (order.orderStatus === 'Order Placed') {
      order.orderStatus = 'In Production';
      order.statusHistory.push({
        status: 'In Production',
        note: `Payment of ₹${order.totalAmount} verified successfully via Razorpay.`,
        timestamp: new Date(),
      });
    }
    await order.save();

    // Step 6: Update Payment record
    const payment = await Payment.findOne({ order: order._id, method: 'Razorpay' }).sort({ createdAt: -1 });
    if (payment) {
      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.paymentMethod = rzpPayment.method || null;
      payment.transactionId = razorpay_payment_id;
      await payment.save();
    }

    // Step 7: Send SMS notification
    const customerPhone = order.customerDetails?.phone;
    if (customerPhone) {
      const normalized = normalizePhone(customerPhone);
      await sendSmsOtp({
        phone: normalized,
        otp: order.orderNumber,
        purpose: 'payment_confirmation',
      }).catch((err) => console.error('SMS notification error:', err));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          verified: true,
          status: 'paid',
          orderNumber: order.orderNumber,
        },
        'Payment verified successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Razorpay Webhook (server-to-server)
 * POST /api/payment/razorpay/webhook
 * Raw body required for signature verification
 * Always returns 200 to acknowledge receipt
 */
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error('Razorpay webhook: Missing signature or webhook secret');
      return res.status(200).json({ status: 'IGNORED' });
    }

    // Verify webhook signature using raw body
    const rawBody = typeof req.body === 'string' ? req.body : req.body.toString();
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error('Razorpay webhook: Invalid signature');
      return res.status(200).json({ status: 'INVALID_SIGNATURE' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : JSON.parse(req.body.toString());

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      if (!paymentEntity) {
        return res.status(200).json({ status: 'NO_PAYMENT_ENTITY' });
      }

      const rzpOrderId = paymentEntity.order_id;
      const rzpPaymentId = paymentEntity.id;

      // Find order
      const order = await Order.findOne({ razorpayOrderId: rzpOrderId });
      if (!order) {
        console.error(`Razorpay webhook: No order found for razorpayOrderId ${rzpOrderId}`);
        return res.status(200).json({ status: 'ORDER_NOT_FOUND' });
      }

      // Prevent duplicate processing
      if (order.paymentStatus === 'paid') {
        return res.status(200).json({ status: 'ALREADY_PROCESSED' });
      }

      // Update order
      order.paymentStatus = 'paid';
      order.paymentMethod = 'Razorpay';
      order.razorpayPaymentId = rzpPaymentId;
      if (order.orderStatus === 'Order Placed') {
        order.orderStatus = 'In Production';
        order.statusHistory.push({
          status: 'In Production',
          note: 'Payment captured via Razorpay webhook.',
          timestamp: new Date(),
        });
      }
      await order.save();

      // Update payment record
      await Payment.findOneAndUpdate(
        { order: order._id, method: 'Razorpay' },
        {
          status: 'paid',
          paidAt: new Date(),
          razorpayPaymentId: rzpPaymentId,
          paymentMethod: paymentEntity.method || null,
          transactionId: rzpPaymentId,
        },
        { new: true, sort: { createdAt: -1 } }
      );
    }

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('Razorpay webhook processing error:', error);
    res.status(200).json({ status: 'ERROR_LOGGED' });
  }
};

// ================================================================
// DIRECT UPI QR PAYMENT (unchanged)
// ================================================================

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

// ================================================================
// ADMIN VERIFICATION (unchanged)
// ================================================================

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

// ================================================================
// PAYMENT HISTORY (unchanged)
// ================================================================

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
