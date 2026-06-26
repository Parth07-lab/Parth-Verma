import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';

// In-memory cart store fallback for development
const userCarts = new Map<string, any[]>();

export async function getCart(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const items = userCarts.get(userId) || [];
    return res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function addToCart(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const { productId, variantId, qty } = req.body;
    if (!productId || !variantId || !qty) {
      return res.status(400).json({ success: false, message: 'Product ID, Variant ID, and quantity are required.' });
    }

    const items = userCarts.get(userId) || [];
    const existingIndex = items.findIndex(item => item.variantId === variantId);

    if (existingIndex > -1) {
      items[existingIndex].qty += qty;
    } else {
      items.push({ productId, variantId, qty });
    }

    userCarts.set(userId, items);
    return res.status(200).json({ success: true, data: items, message: 'Item added to cart.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateCart(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const { variantId, qty } = req.body;
    if (!variantId || qty === undefined) {
      return res.status(400).json({ success: false, message: 'Variant ID and quantity are required.' });
    }

    let items = userCarts.get(userId) || [];
    const itemIndex = items.findIndex(item => item.variantId === variantId);

    if (itemIndex > -1) {
      if (qty <= 0) {
        items.splice(itemIndex, 1);
      } else {
        items[itemIndex].qty = qty;
      }
    }

    userCarts.set(userId, items);
    return res.status(200).json({ success: true, data: items, message: 'Cart updated.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function deleteCartItem(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const { variantId } = req.body;
    if (!variantId) {
      return res.status(400).json({ success: false, message: 'Variant ID is required.' });
    }

    let items = userCarts.get(userId) || [];
    items = items.filter(item => item.variantId !== variantId);

    userCarts.set(userId, items);
    return res.status(200).json({ success: true, data: items, message: 'Item removed from cart.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
