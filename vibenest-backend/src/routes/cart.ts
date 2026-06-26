import { Router } from 'express';
import { getCart, addToCart, updateCart, deleteCartItem } from '../controllers/cart.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Protect all cart routes
router.use(authenticateToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCart);
router.delete('/', deleteCartItem);

export default router;
