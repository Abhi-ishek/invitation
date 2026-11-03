import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { normalizePhone, isValidPhone, verifyOtpHash } from '../utils/otpService.js';
import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, otp } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email, and password are required');
    }

    if (!phone) {
      throw new ApiError(400, 'WhatsApp phone number is required to register');
    }

    const normalizedPhone = normalizePhone(phone);
    if (!isValidPhone(normalizedPhone)) {
      throw new ApiError(
        400,
        'Invalid phone number format. Please provide a valid 10-digit number or international format (e.g. +91 98765 43210)'
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email already exists');
    }

    // Verify Phone OTP
    if (otp) {
      const cleanOtp = otp.toString().trim();
      const otpRecord = await Otp.findOne({
        phone: normalizedPhone,
        purpose: 'phone_verification',
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (!otpRecord) {
        throw new ApiError(400, 'Invalid or expired OTP. Please request a new verification code.');
      }

      if (otpRecord.attempts >= 5) {
        await Otp.deleteOne({ _id: otpRecord._id });
        throw new ApiError(429, 'Too many incorrect OTP attempts. Please request a new verification code.');
      }

      const isMatch = verifyOtpHash(cleanOtp, otpRecord.otp);
      if (!isMatch) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        const remaining = 5 - otpRecord.attempts;
        throw new ApiError(
          400,
          `Incorrect OTP code. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`
        );
      }

      // Valid OTP: consume it
      await Otp.deleteOne({ _id: otpRecord._id });
    } else {
      // Check if phone was pre-verified via /api/otp/verify
      const preVerifiedRecord = await Otp.findOne({
        phone: normalizedPhone,
        purpose: 'phone_verification',
        isVerified: true,
        expiresAt: { $gt: new Date() },
      }).sort({ updatedAt: -1 });

      if (preVerifiedRecord) {
        await Otp.deleteOne({ _id: preVerifiedRecord._id });
      } else {
        throw new ApiError(400, 'Please enter the 6-digit OTP sent to your phone number to complete registration');
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: normalizedPhone,
      isPhoneVerified: true,
      role: email === 'admin@weddingwishcraft.com' ? 'admin' : 'customer',
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res
      .status(201)
      .cookie('accessToken', accessToken, COOKIE_OPTIONS)
      .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
      .json(
        new ApiResponse(
          201,
          {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              isPhoneVerified: !!user.isPhoneVerified,
              role: user.role,
              wishlist: user.wishlist,
            },
            accessToken,
          },
          'Account registered successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Please provide both email and password');
    }

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .cookie('accessToken', accessToken, COOKIE_OPTIONS)
      .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              isPhoneVerified: !!user.isPhoneVerified,
              role: user.role,
              wishlist: user.wishlist,
            },
            accessToken,
          },
          'Logged in successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
    }

    res
      .status(200)
      .clearCookie('accessToken', COOKIE_OPTIONS)
      .clearCookie('refreshToken', COOKIE_OPTIONS)
      .json(new ApiResponse(200, {}, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const existsIndex = user.wishlist.indexOf(productId);
    let added = false;

    if (existsIndex > -1) {
      user.wishlist.splice(existsIndex, 1);
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { wishlist: user.wishlist, added },
          added ? 'Added to Wishlist' : 'Removed from Wishlist'
        )
      );
  } catch (error) {
    next(error);
  }
};
