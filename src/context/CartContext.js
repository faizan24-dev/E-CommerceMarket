"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import { products } from "@/data/mockData";
import { createPersistentStore } from "@/lib/persistentStore";

// Digital goods carry one license per item, so the cart stores a list of unique product ids.
const cartStore = createPersistentStore("em_cart", []);

export const BUNDLE_MIN_ITEMS = 3;
export const BUNDLE_DISCOUNT_RATE = 0.1;

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const productIds = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isCartOpen, setIsCartOpen] = useState(false);

  const items = productIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const qualifiesForBundle = itemCount >= BUNDLE_MIN_ITEMS;
  const discount = qualifiesForBundle ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE * 100) / 100 : 0;
  const total = subtotal - discount;
  const itemsUntilBundle = Math.max(BUNDLE_MIN_ITEMS - itemCount, 0);

  function addItem(productId, { openDrawer = true } = {}) {
    cartStore.set((ids) => (ids.includes(productId) ? ids : [...ids, productId]));
    if (openDrawer) setIsCartOpen(true);
  }

  function removeItem(productId) {
    cartStore.set((ids) => ids.filter((id) => id !== productId));
  }

  function clearCart() {
    cartStore.set([]);
  }

  function isInCart(productId) {
    return productIds.includes(productId);
  }

  const value = {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    qualifiesForBundle,
    itemsUntilBundle,
    isCartOpen,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((open) => !open),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}
