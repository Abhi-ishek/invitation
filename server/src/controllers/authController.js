import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { normalizePhone, isValidPhone } from '../utils/otpService.js';
import jwt from 'jsonwebtoken';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

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
