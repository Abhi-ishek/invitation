import { Router } from 'express';
import { register, login, logout, getMe, toggleWishlist } from '../controllers/authController.js';
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  getPhoneVerificationStatus,
} from '../controllers/otpController.js';
import { verifyJWT, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyJWT, logout);
router.get('/me', verifyJWT, getMe);
router.post('/wishlist/toggle', verifyJWT, toggleWishlist);

// Phone OTP verification routes
router.post('/phone/send-otp', optionalAuth, sendPhoneOtp);
router.post('/phone/verify-otp', optionalAuth, verifyPhoneOtp);
router.get('/phone/status', optionalAuth, getPhoneVerificationStatus);

export default router;
