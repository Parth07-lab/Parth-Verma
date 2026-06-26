import { Router } from 'express';
import {
  register,
  login,
  googleAuth,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  adminLogin
} from '../controllers/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/admin/login', adminLogin);

export default router;
