import { create } from "zustand";

/** UI state shared across distant components (e.g. any "Add to cart" button opens the cart drawer). */
export const useUiStore = create((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
