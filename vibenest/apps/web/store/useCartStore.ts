import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Coupon } from 'shared-types';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; discount: number; total: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (newItem) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].qty += newItem.qty;
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (variantId) => {
        const filtered = get().items.filter((item) => item.variantId !== variantId);
        set({ items: filtered });
      },

      updateQty: (variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(variantId);
          return;
        }
        const updated = get().items.map((item) =>
          item.variantId === variantId ? { ...item, qty } : item
        );
        set({ items: updated });
      },

      applyCoupon: (coupon) => {
        set({ coupon });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      getTotals: () => {
        const items = get().items;
        const coupon = get().coupon;

        const subtotal = items.reduce((sum, item) => {
          const discountedPrice = item.price * (1 - item.discountPct / 100);
          return sum + discountedPrice * item.qty;
        }, 0);

        let discount = 0;
        if (coupon && subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'percentage') {
            discount = subtotal * (coupon.value / 100);
          } else {
            discount = coupon.value;
          }
        }

        const total = Math.max(subtotal - discount, 0);

        return {
          subtotal: parseFloat(subtotal.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
        };
      },
    }),
    {
      name: 'vibenest-cart-storage',
    }
  )
);
