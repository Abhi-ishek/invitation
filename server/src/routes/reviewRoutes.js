import { Router } from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', optionalAuth, createReview);

export default router;
