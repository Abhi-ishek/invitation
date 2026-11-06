import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
  getAllOrders,
  saveWeddingDetails,
} from '../controllers/orderController.js';
import { verifyJWT, optionalAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyJWT, createOrder);
router.get('/my-orders', verifyJWT, getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.put('/:orderNumber/wedding-details', optionalAuth, saveWeddingDetails);

// Admin routes
router.get('/', verifyJWT, verifyAdmin, getAllOrders);
router.put('/:id/status', verifyJWT, verifyAdmin, updateOrderStatus);

export default router;
