import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/*
 * The shopping cart, saved in localStorage. Digital goods carry one licence
 * per item, so each product appears at most once.
 *
 * Items are display snapshots (title, price, image). They are never trusted:
 * checkout sends only product ids and the server prices the order itself.
 *
 * `skipHydration` keeps the first client render identical to the server render
 * (an empty cart); AppBootstrap rehydrates from storage right after.
 */

export const CART_STORAGE_KEY = "em_cart_v2";

function toCartItem(product) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    coverUrl: product.coverUrl,
    fileType: product.fileType,
    storeName: product.seller?.storeName ?? null,
  };
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) =>
          state.items.some((item) => item.id === product.id) ? state : { items: [...state.items, toCartItem(product)] },
        ),
      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),
      removeItems: (productIds) => set((state) => ({ items: state.items.filter((item) => !productIds.includes(item.id)) })),
      clear: () => set({ items: [] }),
      has: (productId) => get().items.some((item) => item.id === productId),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

/** Cart total in cents. Derive it from `items` in components (selectors must return stable values). */
export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
