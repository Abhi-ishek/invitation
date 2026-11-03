import { Router } from 'express';
import {
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

// UPI QR Payment
router.post('/upi/generate-qr', optionalAuth, generateUpiQr);
router.post('/upi/confirm', optionalAuth, confirmUpiPayment);

// Payment History
router.get('/history', verifyJWT, getPaymentHistory);
router.get('/order/:orderId', optionalAuth, getPaymentByOrder);

// Admin UPI Verification
router.get('/admin/pending', verifyJWT, verifyAdmin, getPendingVerifications);
router.patch('/admin/verify', verifyJWT, verifyAdmin, verifyUpiPaymentByAdmin);

// Legacy Razorpay
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
