import { Router } from 'express';
import {
  getProducts,
  getTrendingAndFeatured,
  getProductBySlugOrId,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { verifyJWT, verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/trending', getTrendingAndFeatured);
router.get('/:identifier', getProductBySlugOrId);

// Admin routes
router.post('/', verifyJWT, verifyAdmin, createProduct);
router.put('/:id', verifyJWT, verifyAdmin, updateProduct);
router.delete('/:id', verifyJWT, verifyAdmin, deleteProduct);

export default router;
