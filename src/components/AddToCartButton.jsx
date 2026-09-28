"use client";

import { Check, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

const sizes = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  lg: "h-12 w-full px-6 text-[15px] gap-2",
};

export default function AddToCartButton({ productId, productTitle, size = "sm" }) {
  const { addItem, isInCart, openCart } = useCart();
  const inCart = isInCart(productId);

  if (inCart) {
    return (
      <button
        type="button"
        onClick={openCart}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-success/30 bg-success/5 font-medium text-success transition hover:bg-success/10 ${sizes[size]}`}
        aria-label={`${productTitle} is in your cart. View cart`}
      >
        <Check className="size-4" /> In cart
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-ink font-medium text-white transition hover:bg-ink-soft active:scale-[0.98] ${sizes[size]}`}
      aria-label={`Add ${productTitle} to cart`}
    >
      {size === "lg" ? <ShoppingBag className="size-4" /> : <Plus className="size-4" />}
      Add to cart
    </button>
  );
}
