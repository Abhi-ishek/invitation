import { Router } from 'express';
import { register, login, logout, getMe, toggleWishlist } from '../controllers/authController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyJWT, logout);
router.get('/me', verifyJWT, getMe);
router.post('/wishlist/toggle', verifyJWT, toggleWishlist);

export default router;
