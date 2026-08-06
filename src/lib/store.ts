"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}


function itemKey(productId: string, size?: string) {
  return size ? `${productId}::${size}` : productId;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const key = itemKey(item.productId, item.size);
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.size) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.size) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (productId, size) => {
        const key = itemKey(productId, size);
        set((state) => ({
          items: state.items.filter((i) => itemKey(i.productId, i.size) !== key),
        }));
      },
      updateQuantity: (productId, quantity, size) => {
        const key = itemKey(productId, size);
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.size) === key ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((t, i) => t + i.price * i.quantity, 0),
      getItemCount: () =>
        get().items.reduce((c, i) => c + i.quantity, 0),
    }),
    { name: "cart-storage-v2" }
  )
);

interface WishlistStore {
  items: string[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },
      isInWishlist: (productId) => get().items.includes(productId),
      getCount: () => get().items.length,
    }),
    { name: "wishlist-storage" }
  )
);
