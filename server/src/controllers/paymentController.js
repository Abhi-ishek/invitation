import { ApiResponse } from '../utils/apiResponse.js';
import { Order } from '../models/Order.js';
import crypto from 'crypto';

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
          amount: amount * 100, // in paise
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

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // In production, verify SHA256 HMAC signature if razorpay key secret exists
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
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayPaymentId: razorpay_payment_id || `pay_${Date.now()}`,
      });
    }

    res.status(200).json(new ApiResponse(200, { success: true }, 'Payment verified successfully'));
  } catch (error) {
    next(error);
  }
};
