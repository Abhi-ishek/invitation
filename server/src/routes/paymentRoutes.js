import { Router } from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
