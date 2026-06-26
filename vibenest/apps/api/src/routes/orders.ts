import { Router } from 'express';
import { checkout, getOrders, getOrderById, cancelOrder } from '../controllers/orders.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Protect all order routes
router.use(authenticateToken);

router.post('/checkout', checkout);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);

export default router;
