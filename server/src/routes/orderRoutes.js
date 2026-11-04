import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import { verifyJWT, optionalAuth, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyJWT, createOrder);
router.get('/my-orders', verifyJWT, getMyOrders);
router.get('/track/:orderNumber', trackOrder);

// Admin routes
router.get('/', verifyJWT, verifyAdmin, getAllOrders);
router.put('/:id/status', verifyJWT, verifyAdmin, updateOrderStatus);

export default router;
