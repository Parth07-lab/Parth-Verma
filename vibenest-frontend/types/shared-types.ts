export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  provider: 'local' | 'google';
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Admin {
  id: string;
  email: string;
  role: 'super_admin' | 'product_manager' | 'order_manager' | 'support_executive';
  lastLogin?: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  material?: string;
  price: number;
  discountPct: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  avgRating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  subcategories?: Category[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  qty: number;
  name: string;
  price: number;
  discountPct: number;
  size: string;
  color: string;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  qty: number;
  unitPrice: number;
  productName: string;
  size: string;
  color: string;
  imageUrl?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  transactionId?: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  items: OrderItem[];
  payment?: Payment | null;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  body: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  usageLimit?: number;
  expiresAt: Date;
}

export interface DashboardStats {
  revenue: number;
  ordersCount: number;
  usersCount: number;
  conversionRate: number;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  categorySales: Array<{ name: string; value: number }>;
  weeklySales: Array<{ name: string; sales: number }>;
}
