import { Coupon } from '../models/Coupon.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new ApiError(400, 'Coupon code is required');
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiry: { $gte: new Date() },
    });

    if (!coupon) {
      throw new ApiError(404, 'Invalid or expired promo code');
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      throw new ApiError(400, 'This promo code has reached its maximum usage limit');
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          firstOrderOnly: coupon.firstOrderOnly,
        },
        `Coupon applied: ${coupon.discountPercent}% OFF!`
      )
    );
  } catch (error) {
    next(error);
  }
};
