"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  variantId?: string;
  slug: string;
  name: string;
  price: number;
  basePrice: number;
  image: string;
  quantity: number;
  variant?: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  count: number;
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void;
  clear: () => void;
  setCoupon: (code: string | null, discount: number) => void;
  clearCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function itemKey(id: string, variantId?: string) {
  return variantId ? `${id}__${variantId}` : id;
}

export function computeCartTotals(items: CartItem[]) {
  return {
    total: items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0),
    count: items.reduce((sum, i) => sum + Number(i.quantity || 0), 0),
  };
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      count: 0,
      couponCode: null,
      couponDiscount: 0,
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const key = itemKey(item.id, item.variantId);
        const existing = items.find(
          (i) => itemKey(i.id, i.variantId) === key
        );
        const qty = existing ? existing.quantity + quantity : quantity;
        const clamped = item.maxStock > 0 ? Math.min(qty, item.maxStock) : qty;
        const nextItems = existing
          ? items.map((i) =>
              itemKey(i.id, i.variantId) === key ? { ...i, quantity: clamped } : i
            )
          : [
              ...items,
              { ...item, quantity: Math.min(quantity, item.maxStock || quantity) },
            ];
        set({
          items: nextItems,
          ...computeCartTotals(nextItems),
          isOpen: true,
        });
      },
      removeItem: (id, variantId) => {
        const nextItems = get().items.filter(
          (i) => itemKey(i.id, i.variantId) !== itemKey(id, variantId)
        );
        set({
          items: nextItems,
          ...computeCartTotals(nextItems),
        });
      },
      updateQuantity: (id, variantId, quantity) => {
        if (quantity <= 0) {
          const nextItems = get().items.filter(
            (i) => itemKey(i.id, i.variantId) !== itemKey(id, variantId)
          );
          set({
            items: nextItems,
            ...computeCartTotals(nextItems),
          });
          return;
        }
        const nextItems = get().items.map((i) => {
          if (itemKey(i.id, i.variantId) !== itemKey(id, variantId)) return i;
          const clamped = i.maxStock > 0 ? Math.min(quantity, i.maxStock) : quantity;
          return { ...i, quantity: clamped };
        });
        set({
          items: nextItems,
          ...computeCartTotals(nextItems),
        });
      },
      clear: () =>
        set({
          items: [],
          total: 0,
          count: 0,
          couponCode: null,
          couponDiscount: 0,
        }),
      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "dyc-cart",
      skipHydration: true,
      // P0-3: isOpen asla localStorage'a kaydedilmez, sayfa geçişinde çekmece kendiliğinden açılmaz
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          const stats = computeCartTotals(state.items);
          state.total = stats.total;
          state.count = stats.count;
          state.isOpen = false;
        }
      },
    }
  )
);
