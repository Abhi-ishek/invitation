import { Router } from 'express';
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  getPhoneVerificationStatus,
} from '../controllers/otpController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/send', optionalAuth, sendPhoneOtp);
router.post('/verify', optionalAuth, verifyPhoneOtp);
router.get('/status', optionalAuth, getPhoneVerificationStatus);

export default router;

