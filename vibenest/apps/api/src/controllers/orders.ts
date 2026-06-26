import { Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// Order creation & payment trigger
export async function checkout(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const { items, shippingAddressId, newAddress, couponCode, paymentProvider } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required.' });
    }

    // 1. Get or Create Address
    let addressId = shippingAddressId;
    if (newAddress) {
      const address = await prisma.address.create({
        data: {
          userId,
          line1: newAddress.line1,
          line2: newAddress.line2,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          isDefault: newAddress.isDefault || false,
        }
      });
      addressId = address.id;
    }

    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    // 2. Validate variants & calculate total
    let totalSubtotal = 0;
    const orderItemsToCreate: any[] = [];
    const variantUpdates: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!product || !product.isActive || product.deletedAt) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      const variant = product.variants.find(v => v.id === item.variantId);
      if (!variant) {
        return res.status(400).json({ success: false, message: `Product variant not found: ${item.variantId}` });
      }

      if (variant.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name} (Variant: ${variant.color} / ${variant.size}). Available: ${variant.stock}`
        });
      }

      // Price calculation (including product discount)
      const discountedUnitPrice = product.price * (1 - product.discountPct / 100);
      totalSubtotal += discountedUnitPrice * item.qty;

      orderItemsToCreate.push({
        productId: product.id,
        variantId: variant.id,
        qty: item.qty,
        unitPrice: discountedUnitPrice,
      });

      variantUpdates.push({
        id: variant.id,
        newStock: variant.stock - item.qty,
      });
    }

    // 3. Process Coupon
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });

      if (coupon && coupon.expiresAt > new Date() && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) {
        if (totalSubtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'percentage') {
            discountAmount = totalSubtotal * (coupon.value / 100);
          } else {
            discountAmount = coupon.value;
          }
          // Increment usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
          });
        }
      }
    }

    const finalAmount = Math.max(totalSubtotal - discountAmount, 0);

    // 4. Update stocks
    for (const update of variantUpdates) {
      await prisma.productVariant.update({
        where: { id: update.id },
        data: { stock: update.newStock }
      });
    }

    // 5. Create Order
    const order = await prisma.order.create({
      data: {
        userId,
        status: paymentProvider === 'cod' ? 'confirmed' : 'pending',
        totalAmount: finalAmount,
        paymentStatus: paymentProvider === 'cod' ? 'pending' : 'paid', // Mock online payments as paid immediately
        shippingAddressId: addressId,
        items: {
          create: orderItemsToCreate
        }
      },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          }
        },
        shippingAddress: true,
      }
    });

    // 6. Create Payment
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: paymentProvider,
        transactionId: paymentProvider === 'cod' ? null : `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        amount: finalAmount,
        status: paymentProvider === 'cod' ? 'pending' : 'success',
      }
    });

    // Trigger mock background job (BullMQ stub)
    console.log(`[Queue Mock Job] Order placed successfully: ID ${order.id}. Enqueuing receipt confirmation email task.`);

    // Add customer notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'order_update',
        message: `Your order ${order.id.slice(0, 8)} has been placed successfully.`,
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: order
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// User's order list
export async function getOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          }
        },
        payment: true,
        shippingAddress: true,
      }
    });

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Order detail
export async function getOrderById(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          }
        },
        payment: true,
        shippingAddress: true,
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Cancel Order
export async function cancelOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled.' });
    }

    // Restore stock inventory
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.qty } }
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'cancelled' },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        type: 'order_update',
        message: `Your order ${order.id.slice(0, 8)} has been cancelled.`,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
      data: updatedOrder
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
