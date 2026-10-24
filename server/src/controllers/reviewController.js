import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, name, rating, comment, eventType } = req.body;

    if (!productId || !comment) {
      throw new ApiError(400, 'Product ID and review comment are required');
    }

    const review = await Review.create({
      product: productId,
      user: {
        name: name || req.user?.name || 'Happy Couple',
        avatar: '',
      },
      rating: Number(rating) || 5,
      comment,
      eventType: eventType || 'Wedding Invitation Video',
    });

    // Update product rating and reviews count
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(2)),
      numReviews: allReviews.length,
    });

    res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
  } catch (error) {
    next(error);
  }
};
