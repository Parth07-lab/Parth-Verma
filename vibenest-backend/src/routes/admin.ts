import { Router } from 'express';
import {
  getAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  getAdminOrders,
  updateOrderStatus,
  getAdminUsers,
  toggleUserSuspension,
  getAdminCoupons,
  createCoupon,
  uploadImage
} from '../controllers/admin.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with Admin auth session middleware
router.use(authenticateAdmin);

// Analytics
router.get('/analytics', getAnalytics);

// Products
router.post('/products', authorizeRoles('super_admin', 'product_manager'), createProduct);
router.put('/products/:id', authorizeRoles('super_admin', 'product_manager'), updateProduct);
router.delete('/products/:id', authorizeRoles('super_admin', 'product_manager'), deleteProduct);

// Categories
router.post('/categories', authorizeRoles('super_admin', 'product_manager'), createCategory);

// Orders
router.get('/orders', authorizeRoles('super_admin', 'order_manager'), getAdminOrders);
router.put('/orders/:id', authorizeRoles('super_admin', 'order_manager'), updateOrderStatus);

// Users
router.get('/users', authorizeRoles('super_admin', 'support_executive'), getAdminUsers);
router.put('/users/:id/suspend', authorizeRoles('super_admin'), toggleUserSuspension);

// Coupons
router.get('/coupons', authorizeRoles('super_admin'), getAdminCoupons);
router.post('/coupons', authorizeRoles('super_admin'), createCoupon);

// Asset Upload (Cloudinary signed request stub)
router.post('/upload', uploadImage);

export default router;
