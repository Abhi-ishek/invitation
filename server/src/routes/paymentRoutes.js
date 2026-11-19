import { Router } from 'express';
import {
  getCashfreePublicConfig,
  createCashfreeOrder,
  verifyCashfreePayment,
  handleCashfreeWebhook,
  generateUpiQr,
  confirmUpiPayment,
  getPaymentHistory,
  getPaymentByOrder,
  getPendingVerifications,
  verifyUpiPaymentByAdmin,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { verifyJWT, optionalAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// ========================
// CASHFREE PAYMENT GATEWAY
// ========================
router.get('/cashfree/config', getCashfreePublicConfig);
router.post('/cashfree/create-order', optionalAuth, createCashfreeOrder);
router.post('/cashfree/verify', optionalAuth, verifyCashfreePayment);
router.post('/cashfree/webhook', handleCashfreeWebhook);

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

// ========================
// LEGACY RAZORPAY (OPTIONAL)
// ========================
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
