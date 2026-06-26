import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  searchProducts,
  getCategories,
  getFeaturedProducts
} from '../controllers/products.js';

const router = Router();

router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);

export default router;
