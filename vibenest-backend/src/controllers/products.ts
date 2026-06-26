import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

// List products with filters, sort, and pagination
export async function getProducts(req: Request, res: Response) {
  try {
    const { category, size, color, priceMin, priceMax, sort, page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query filters
    const where: any = { isActive: true, deletedAt: null };

    if (category) {
      where.category = {
        OR: [
          { slug: category as string },
          { parent: { slug: category as string } }
        ]
      };
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }

    if (size || color) {
      where.variants = {
        some: {}
      };
      if (size) where.variants.some.size = size as string;
      if (color) where.variants.some.color = color as string;
    }

    // Build Sort options
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'best_selling') {
      orderBy = { stock: 'asc' }; // Mock criteria: items with less stock are popular
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          variants: true,
          reviews: true,
        }
      }),
      prisma.product.count({ where })
    ]);

    // Format products to include average rating
    const formattedProducts = products.map(prod => {
      const totalReviews = prod.reviews.length;
      const avgRating = totalReviews > 0 
        ? prod.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews 
        : 0;

      // Extract reviews to keep payload lighter
      const { reviews, ...rest } = prod;
      return {
        ...rest,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: totalReviews,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Single Product Detail by Slug
export async function getProductBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        category: true,
        reviews: {
          include: {
            user: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product || product.deletedAt || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const totalReviews = product.reviews.length;
    const avgRating = totalReviews > 0 
      ? product.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews 
      : 0;

    const formattedReviews = product.reviews.map(rev => ({
      id: rev.id,
      userId: rev.userId,
      userName: rev.user.name,
      productId: rev.productId,
      rating: rev.rating,
      body: rev.body,
      isVerified: rev.isVerified,
      createdAt: rev.createdAt
    }));

    const responseData = {
      ...product,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewsCount: totalReviews,
      reviews: formattedReviews
    };

    return res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Search and Autocomplete
export async function searchProducts(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        OR: [
          { name: { contains: q as string } },
          { description: { contains: q as string } },
          { sku: { contains: q as string } }
        ]
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 }
      },
      take: 8
    });

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Category Tree
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      }
    });

    // Return main top-level categories containing their subcategories
    const rootCategories = categories.filter(cat => cat.parentId === null);

    return res.status(200).json({
      success: true,
      data: rootCategories
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Featured Products
export async function getFeaturedProducts(req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        reviews: true,
      }
    });

    const formattedProducts = products.map(prod => {
      const totalReviews = prod.reviews.length;
      const avgRating = totalReviews > 0 
        ? prod.reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews 
        : 0;

      const { reviews, ...rest } = prod;
      return {
        ...rest,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewsCount: totalReviews,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedProducts
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
