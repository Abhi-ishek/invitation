import crypto from 'crypto';
import { ApiError } from './apiError.js';

/**
 * Cashfree Payment Gateway Config & API Service
 * Supports both SANDBOX and PRODUCTION environments via .env
 */

const getCashfreeConfig = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const env = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();
  const apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';

  const baseUrl = env === 'PRODUCTION' || env === 'PROD'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  return {
    appId,
    secretKey,
    env,
    apiVersion,
    baseUrl,
    isConfigured: Boolean(appId && secretKey),
  };
};

/**
 * Standard headers for Cashfree PG API v2023-08-01
 */
const getHeaders = (idempotencyKey = null) => {
  const config = getCashfreeConfig();
  if (!config.isConfigured) {
    throw new ApiError(500, 'Cashfree credentials (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) are not configured in environment variables.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-client-id': config.appId,
    'x-client-secret': config.secretKey,
    'x-api-version': config.apiVersion,
  };

  if (idempotencyKey) {
    headers['x-idempotence-key'] = idempotencyKey;
  }

  return { headers, baseUrl: config.baseUrl };
};

/**
 * Create a new Payment Order on Cashfree
 * Returns payment_session_id and order_id to initiate checkout on client
 */
export const createCashfreeOrderService = async ({
  orderId,
  orderAmount,
  orderCurrency = 'INR',
  customerDetails,
  returnUrl,
  notifyUrl,
}) => {
  const { headers, baseUrl } = getHeaders(`order_${orderId}_${Date.now()}`);

  const sanitizedOrderId = String(orderId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanPhone = customerDetails.phone ? String(customerDetails.phone).replace(/[^0-9]/g, '').slice(-10) : '9999999999';

  const payload = {
    order_id: sanitizedOrderId,
    order_amount: Number(orderAmount).toFixed(2),
    order_currency: orderCurrency,
    customer_details: {
      customer_id: customerDetails.customerId || `cust_${cleanPhone}`,
      customer_name: customerDetails.name || 'Valued Customer',
      customer_email: customerDetails.email || 'customer@weddingwishcraft.in',
      customer_phone: cleanPhone.length === 10 ? cleanPhone : '9999999999',
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl,
      payment_methods: 'cc,dc,upi,nb,wallet,paylater',
    },
    order_note: `Wedding Wishcraft Order ${orderId}`,
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status || 400,
      responseData.message || responseData.error || 'Failed to create Cashfree order'
    );
  }

  return responseData;
};

/**
 * Fetch and verify payment status of an Order directly from Cashfree
 */
export const fetchCashfreeOrderService = async (cashfreeOrderId) => {
  const { headers, baseUrl } = getHeaders();

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(cashfreeOrderId)}`, {
    method: 'GET',
    headers,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status || 400,
      responseData.message || 'Failed to fetch Cashfree order status'
    );
  }

  return responseData;
};

/**
 * Fetch all payments for an Order from Cashfree
 */
export const fetchCashfreeOrderPaymentsService = async (cashfreeOrderId) => {
  const { headers, baseUrl } = getHeaders();

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(cashfreeOrderId)}/payments`, {
    method: 'GET',
    headers,
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status || 400,
      responseData.message || 'Failed to fetch Cashfree order payments'
    );
  }

  return responseData;
};

/**
 * Verify Cashfree Webhook Signature
 * Cashfree signs webhook payloads with HMAC SHA256 using the client secret
 */
export const verifyCashfreeWebhookSignature = (rawBody, signature, timestamp) => {
  const config = getCashfreeConfig();
  if (!config.secretKey) return false;

  try {
    const dataToSign = `${timestamp}${rawBody}`;
    const generatedSignature = crypto
      .createHmac('sha256', config.secretKey)
      .update(dataToSign)
      .digest('base64');

    return generatedSignature === signature;
  } catch (err) {
    console.error('Error verifying Cashfree webhook signature:', err);
    return false;
  }
};

export { getCashfreeConfig };
