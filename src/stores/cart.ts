"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // productId
  variantId?: string; // varyant kimliği (aynı ürün farklı varyantlar ayrı tutulur)
  slug: string;
  name: string;
  price: number; // varyant fiyat farkı dahil final fiyat
  basePrice: number; // ürün baz fiyat (indirimli değil)
  image: string;
  quantity: number;
  variant?: string; // gösterim etiketi
  maxStock: number; // stok sınırı
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string | null;
  couponDiscount: number; // yüzde veya tutar (server'da hesaplanır)
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, variantId: string | undefined, quantity: number) => void;
  clear: () => void;
  setCoupon: (code: string | null, discount: number) => void;
  clearCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  get total(): number;
  get count(): number;
}

function itemKey(id: string, variantId?: string) {
  return variantId ? `${id}__${variantId}` : id;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
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
        if (existing) {
          set({
            items: items.map((i) =>
              itemKey(i.id, i.variantId) === key ? { ...i, quantity: clamped } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items,
              { ...item, quantity: Math.min(quantity, item.maxStock || quantity) },
            ],
            isOpen: true,
          });
        }
      },
      removeItem: (id, variantId) =>
        set({
          items: get().items.filter(
            (i) => itemKey(i.id, i.variantId) !== itemKey(id, variantId)
          ),
        }),
      updateQuantity: (id, variantId, quantity) => {
        if (quantity <= 0) {
          set({
            items: get().items.filter(
              (i) => itemKey(i.id, i.variantId) !== itemKey(id, variantId)
            ),
          });
          return;
        }
        set({
          items: get().items.map((i) => {
            if (itemKey(i.id, i.variantId) !== itemKey(id, variantId)) return i;
            const clamped = i.maxStock > 0 ? Math.min(quantity, i.maxStock) : quantity;
            return { ...i, quantity: clamped };
          }),
        });
      },
      clear: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "dyc-cart",
      skipHydration: true, // Hydration mismatch'i önler — manuel rehydrate gerekir
    }
  )
);
