import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ApiError } from './apiError.js';

/**
 * Razorpay Payment Gateway Service
 * Singleton instance + order creation, signature verification, payment fetch
 */

let razorpayInstance = null;

/**
 * Get or create a singleton Razorpay SDK instance
 */
export const getRazorpayInstance = () => {
  if (razorpayInstance) return razorpayInstance;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'your_razorpay_key_id' || keySecret === 'your_razorpay_key_secret') {
    throw new ApiError(
      500,
      'Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are not configured yet in server/.env. Please add your Razorpay API Keys.'
    );
  }

  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayInstance;
};

/**
 * Create a Razorpay Order via SDK
 * @param {Object} params
 * @param {number} params.amount - Amount in INR (rupees, NOT paise)
 * @param {string} [params.currency='INR']
 * @param {string} params.receipt - Unique receipt id (e.g. order number)
 * @param {Object} [params.notes] - Key-value notes for the order
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrderService = async ({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}) => {
  const instance = getRazorpayInstance();

  const options = {
    amount: Math.round(Number(amount) * 100), // Razorpay expects paise
    currency,
    receipt,
    notes,
  };

  const order = await instance.orders.create(options);
  return order;
};

/**
 * Verify Razorpay payment signature using HMAC SHA256
 * @param {Object} params
 * @param {string} params.razorpay_order_id
 * @param {string} params.razorpay_payment_id
 * @param {string} params.razorpay_signature
 * @returns {boolean}
 */
export const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new ApiError(500, 'RAZORPAY_KEY_SECRET is not configured.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  return generatedSignature === razorpay_signature;
};

/**
 * Fetch payment details from Razorpay API
 * @param {string} paymentId - Razorpay payment ID (pay_xxx)
 * @returns {Promise<Object>} Payment details
 */
export const fetchRazorpayPayment = async (paymentId) => {
  const instance = getRazorpayInstance();
  const payment = await instance.payments.fetch(paymentId);
  return payment;
};

/**
 * Verify Razorpay Webhook Signature
 * @param {string|Buffer} body - Raw request body
 * @param {string} signature - x-razorpay-signature header value
 * @param {string} secret - Webhook secret from Razorpay dashboard
 * @returns {boolean}
 */
export const verifyWebhookSignature = (body, signature, secret) => {
  try {
    Razorpay.validateWebhookSignature(
      typeof body === 'string' ? body : body.toString(),
      signature,
      secret
    );
    return true;
  } catch (err) {
    console.error('Razorpay webhook signature verification failed:', err.message);
    return false;
  }
};
