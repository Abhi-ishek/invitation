import { Order } from '../models/Order.js';
import { Coupon } from '../models/Coupon.js';
import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { sendEmailNotification } from '../utils/mailer.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, customerDetails, paymentMethod = 'Razorpay', couponCode } = req.body;

    if (!items || items.length === 0) {
      throw new ApiError(400, 'Order items are required');
    }

    if (!customerDetails?.name || !customerDetails?.email || !customerDetails?.phone) {
      throw new ApiError(400, 'Customer name, email, and phone number are required');
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        throw new ApiError(404, `Product not found: ${item.productId}`);
      }
      subtotal += product.price;
      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        customizationData: item.customizationData || {},
      });
    }

    // Apply coupon if provided
    let discount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiry: { $gte: new Date() },
      });

      if (coupon) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
        validCouponCode = coupon.code;
        coupon.timesUsed += 1;
        await coupon.save();
      }
    }

    const totalAmount = Math.max(0, subtotal - discount);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `#WW${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      user: req.user?._id || null,
      customerDetails,
      items: orderItems,
      totalAmount,
      discount,
      couponUsed: validCouponCode,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'pending',
      orderStatus: 'Order Placed',
      statusHistory: [
        {
          status: 'Order Placed',
          note: 'Your order was received and queued for customization.',
          timestamp: new Date(),
        },
      ],
    });

    // Send order confirmation email
    sendEmailNotification({
      to: customerDetails.email,
      subject: `💍 Order Confirmed: ${orderNumber} - Wedding Wishcraft`,
      html: `
        <h2>Thank you, ${customerDetails.name}!</h2>
        <p>Your wedding invitation video order <strong>${orderNumber}</strong> has been placed.</p>
        <p>Total Amount: <strong>₹${totalAmount.toLocaleString('en-IN')}</strong></p>
        <p>Our motion artists are beginning work. You will receive your video preview within 24 hours.</p>
      `,
    });

    res.status(201).json(new ApiResponse(201, order, 'Order created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, orders, 'Orders fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const formattedNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    const order = await Order.findOne({
      $or: [
        { orderNumber: formattedNumber.toUpperCase() },
        { orderNumber: orderNumber.toUpperCase() },
      ],
    }).populate('items.product');

    if (!order) {
      throw new ApiError(404, `No wedding invitation order found matching: ${orderNumber}`);
    }

    res.status(200).json(new ApiResponse(200, order, 'Order tracking details retrieved'));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, previewVideoUrl, finalVideoUrl } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (status) {
      order.orderStatus = status;
      order.statusHistory.push({
        status,
        note: note || `Order updated to ${status}`,
        timestamp: new Date(),
      });
    }

    if (previewVideoUrl) order.previewVideoUrl = previewVideoUrl;
    if (finalVideoUrl) {
      order.finalVideoUrl = finalVideoUrl;
      order.orderStatus = 'Completed';
    }

    await order.save();

    // Notify customer
    sendEmailNotification({
      to: order.customerDetails.email,
      subject: `🎬 Update on your Invitation Video (${order.orderNumber}): ${status}`,
      html: `
        <h3>Hello ${order.customerDetails.name},</h3>
        <p>Your wedding invitation video status is now: <strong>${status}</strong>.</p>
        ${previewVideoUrl ? `<p><a href="${previewVideoUrl}">Click here to watch your video preview</a></p>` : ''}
        ${finalVideoUrl ? `<p><a href="${finalVideoUrl}">Click here to download your final 4K video!</a></p>` : ''}
      `,
    });

    res.status(200).json(new ApiResponse(200, order, 'Order updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json(
      new ApiResponse(
        200,
        { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
        'All orders fetched'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const saveWeddingDetails = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const formattedNumber = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

    const order = await Order.findOne({
      $or: [
        { orderNumber: formattedNumber.toUpperCase() },
        { orderNumber: orderNumber.toUpperCase() },
      ],
    });

    if (!order) {
      throw new ApiError(404, `No wedding invitation order found matching: ${orderNumber}`);
    }

    const {
      groomName = '',
      groomMotherName = '',
      groomFatherName = '',
      brideName = '',
      brideMotherName = '',
      brideFatherName = '',
      haldiDate = '',
      haldiTimings = '',
      haldiVenue = '',
      weddingDate = '',
      weddingTimings = '',
      weddingVenue = '',
      mehendiDate = '',
      mehendiTimings = '',
      mehendiVenue = '',
      additionalNotes = '',
    } = req.body;

    order.weddingDetails = {
      groomName: groomName.trim(),
      groomMotherName: groomMotherName.trim(),
      groomFatherName: groomFatherName.trim(),
      brideName: brideName.trim(),
      brideMotherName: brideMotherName.trim(),
      brideFatherName: brideFatherName.trim(),
      haldiDate: haldiDate.trim(),
      haldiTimings: haldiTimings.trim(),
      haldiVenue: haldiVenue.trim(),
      weddingDate: weddingDate.trim(),
      weddingTimings: weddingTimings.trim(),
      weddingVenue: weddingVenue.trim(),
      mehendiDate: mehendiDate.trim(),
      mehendiTimings: mehendiTimings.trim(),
      mehendiVenue: mehendiVenue.trim(),
      additionalNotes: additionalNotes.trim(),
      submittedAt: new Date(),
    };

    // Synchronize first item customizationData if available
    if (order.items && order.items.length > 0) {
      const itemCustom = order.items[0].customizationData || {};
      if (brideName) itemCustom.brideName = brideName.trim();
      if (groomName) itemCustom.groomName = groomName.trim();
      if (weddingDate) itemCustom.weddingDate = weddingDate.trim();
      if (weddingVenue) itemCustom.venue = weddingVenue.trim();
      if (additionalNotes) itemCustom.notes = additionalNotes.trim();
      order.items[0].customizationData = itemCustom;
    }

    order.statusHistory.push({
      status: order.orderStatus,
      note: 'Wedding and ceremony details submitted by couple.',
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json(
      new ApiResponse(200, order, 'Wedding invitation details successfully saved')
    );
  } catch (error) {
    next(error);
  }
};
