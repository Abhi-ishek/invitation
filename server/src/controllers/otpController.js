import { Otp } from '../models/Otp.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import {
  normalizePhone,
  isValidPhone,
  generateOtp,
  hashOtp,
  verifyOtpHash,
  sendSmsOtp,
} from '../utils/otpService.js';

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Request an OTP for phone verification
 * Public endpoint (works with or without login)
 * POST /api/auth/phone/send-otp OR /api/otp/send
 */
export const sendPhoneOtp = async (req, res, next) => {
  try {
    const rawPhone = req.body?.phone || req.user?.phone;
    const purpose = req.body?.purpose || 'phone_verification';

    if (!rawPhone) {
      throw new ApiError(400, 'Please provide a valid phone number');
    }

    const normalized = normalizePhone(rawPhone);

    if (!isValidPhone(normalized)) {
      throw new ApiError(
        400,
        'Invalid phone number format. Please provide a valid 10-digit number or international format (e.g. +91 98765 43210)'
      );
    }

    // Rate Limiting: Check if an OTP was sent recently (Cooldown enforcement)
    const existingOtp = await Otp.findOne({
      phone: normalized,
      purpose,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (existingOtp) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000);
      if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
        const waitSeconds = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
        throw new ApiError(
          429,
          `Please wait ${waitSeconds}s before requesting a new OTP code.`
        );
      }
      // Clean up previous active OTP before creating a fresh one
      await Otp.deleteMany({ phone: normalized, purpose });
    }

    // Generate fresh 6-digit OTP
    const plainOtp = generateOtp(6);
    const hashed = hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save hashed OTP in database
    await Otp.create({
      phone: normalized,
      otp: hashed,
      purpose,
      attempts: 0,
      isVerified: false,
      expiresAt,
    });

    // Send SMS
    const dispatchResult = await sendSmsOtp({
      phone: normalized,
      otp: plainOtp,
      purpose,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          phone: normalized,
          cooldownSeconds: RESEND_COOLDOWN_SECONDS,
          expiresInMinutes: OTP_EXPIRY_MINUTES,
          simulated: dispatchResult.simulated || false,
          ...(dispatchResult.devOtp && { devOtp: dispatchResult.devOtp }),
        },
        'OTP sent successfully to your phone number'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify submitted OTP
 * Public endpoint (works with or without login)
 * POST /api/auth/phone/verify-otp OR /api/otp/verify
 */
export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const rawPhone = req.body?.phone || req.user?.phone;
    const { otp, purpose = 'phone_verification' } = req.body;

    if (!rawPhone || !otp) {
      throw new ApiError(400, 'Both phone number and 6-digit OTP code are required');
    }

    const cleanOtp = otp.toString().trim();
    if (!/^\d{4,8}$/.test(cleanOtp)) {
      throw new ApiError(400, 'OTP must be a valid numeric code');
    }

    const normalized = normalizePhone(rawPhone);

    // Find the latest valid OTP for this phone and purpose
    const otpRecord = await Otp.findOne({
      phone: normalized,
      purpose,
      isVerified: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new ApiError(400, 'Invalid or expired OTP. Please request a new verification code.');
    }

    // Check maximum attempts limit
    if (otpRecord.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(
        429,
        'Maximum verification attempts exceeded. For security reasons, this OTP has been invalidated. Please request a new one.'
      );
    }

    // Validate hash
    const isMatch = verifyOtpHash(cleanOtp, otpRecord.otp);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_VERIFICATION_ATTEMPTS - otpRecord.attempts;
      throw new ApiError(
        400,
        `Incorrect OTP. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
      );
    }

    // OTP is valid! Clean up OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    // If authenticated user, mark their account as phone verified
    let updatedUser = null;
    if (req.user?._id) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          phone: normalized,
          isPhoneVerified: true,
        },
        { new: true }
      );
    } else {
      // If unauthenticated, check if any existing account has this phone number and update it
      updatedUser = await User.findOneAndUpdate(
        { phone: normalized },
        { isPhoneVerified: true },
        { new: true }
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          verified: true,
          phone: normalized,
          user: updatedUser
            ? {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                isPhoneVerified: updatedUser.isPhoneVerified,
                role: updatedUser.role,
              }
            : null,
        },
        'Phone number verified successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Check phone verification status
 * GET /api/auth/phone/status
 */
export const getPhoneVerificationStatus = async (req, res, next) => {
  try {
    const rawPhone = req.query?.phone || req.user?.phone;

    if (!rawPhone) {
      throw new ApiError(400, 'Phone number is required to check status');
    }

    const normalized = normalizePhone(rawPhone);
    const user = await User.findOne({ phone: normalized });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          phone: normalized,
          isVerified: !!user?.isPhoneVerified,
          hasAccount: !!user,
        },
        'Phone verification status retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

