import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request. No token provided.');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || 'wedding_wishcraft_access_secret_key_2026'
    );

    const user = await User.findById(decodedToken?.id).select('-password');
    if (!user) {
      throw new ApiError(401, 'Invalid Access Token or user no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || 'Invalid Access Token'));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || 'wedding_wishcraft_access_secret_key_2026'
      );
      req.user = await User.findById(decoded?.id).select('-password');
    }
  } catch (err) {
    // silently continue as guest
    req.user = null;
  }
  next();
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Administrator privileges required.'));
  }
  next();
};
