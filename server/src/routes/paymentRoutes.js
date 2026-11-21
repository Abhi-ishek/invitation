import { Router } from 'express';
import express from 'express';
import {
  getRazorpayPublicConfig,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  generateUpiQr,
  confirmUpiPayment,
  getPaymentHistory,
  getPaymentByOrder,
  getPendingVerifications,
  verifyUpiPaymentByAdmin,
} from '../controllers/paymentController.js';
import { verifyJWT, optionalAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// ========================
// RAZORPAY PAYMENT GATEWAY
// ========================
router.get('/razorpay/config', getRazorpayPublicConfig);
router.post('/razorpay/create-order', optionalAuth, createRazorpayOrder);
router.post('/razorpay/verify', optionalAuth, verifyRazorpayPayment);
router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), handleRazorpayWebhook);

// ========================
// DIRECT UPI QR PAYMENT
// ========================
router.post('/upi/generate-qr', optionalAuth, generateUpiQr);
router.post('/upi/confirm', optionalAuth, confirmUpiPayment);

// ========================
// PAYMENT HISTORY
// ========================
router.get('/history', verifyJWT, getPaymentHistory);
router.get('/order/:orderId', optionalAuth, getPaymentByOrder);

// ========================
// ADMIN VERIFICATION
// ========================
router.get('/admin/pending', verifyJWT, verifyAdmin, getPendingVerifications);
router.patch('/admin/verify', verifyJWT, verifyAdmin, verifyUpiPaymentByAdmin);

export default router;
