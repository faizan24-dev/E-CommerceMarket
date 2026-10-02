"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Adds every product in a bundle to the cart; the cart applies its 10% bundle discount. */
export default function AddBundleButton({ productIds }) {
  const { addItem, isInCart, openCart } = useCart();
  const allInCart = productIds.every((id) => isInCart(id));

  function handleClick() {
    productIds.forEach((id) => addItem(id, { openDrawer: false }));
    openCart();
  }

  return (
    <button
      type="button"
      onClick={allInCart ? openCart : handleClick}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
        allInCart
          ? "border border-success/30 bg-success/5 text-success hover:bg-success/10"
          : "bg-ink text-white hover:bg-ink-soft"
      }`}
    >
      {allInCart ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {allInCart ? "Bundle in cart" : "Add bundle to cart"}
    </button>
  );
}
