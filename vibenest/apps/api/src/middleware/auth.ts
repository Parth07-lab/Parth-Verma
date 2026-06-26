import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vibenest_super_secret_jwt_key_123!';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    phone?: string;
    name: string;
  };
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

export function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, adminPayload: any) => {
    if (err || !adminPayload.role) {
      return res.status(403).json({ success: false, message: 'Invalid or expired admin token.' });
    }

    try {
      const adminUser = await prisma.admin.findUnique({
        where: { id: adminPayload.id }
      });

      if (!adminUser) {
        return res.status(403).json({ success: false, message: 'Admin user not found.' });
      }

      req.admin = {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      };
      next();
    } catch (dbErr) {
      return res.status(500).json({ success: false, message: 'Database error in authentication.' });
    }
  });
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
    }

    if (!allowedRoles.includes(req.admin.role) && req.admin.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
}
