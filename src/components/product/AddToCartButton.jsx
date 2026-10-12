"use client";

import Link from "next/link";
import { Check, Library, Plus, ShoppingBag } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

/**
 * Add-to-cart for a product DTO. Shows "In your library" for products the user
 * already owns and "Your product" for the seller's own listings.
 */
export default function AddToCartButton({ product, size = "sm" }) {
  const inCart = useCartStore((state) => state.items.some((item) => item.id === product.id));
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const isOwned = useAuthStore((state) => state.ownedProductIds.includes(product.id));
  const isOwnProduct = useAuthStore((state) => state.user?.id === product.seller?.id);

  const fullWidth = size === "lg";
  const sizeName = size === "lg" ? "lg" : "sm";

  if (isOwnProduct) {
    return (
      <span className={buttonClasses({ variant: "secondary", size: sizeName, fullWidth, className: "pointer-events-none text-muted" })}>
        Your product
      </span>
    );
  }

  if (isOwned) {
    return (
      <Link href="/account" className={buttonClasses({ variant: "success", size: sizeName, fullWidth })}>
        <Library className="size-4" aria-hidden="true" /> {size === "lg" ? "In your library" : "Owned"}
      </Link>
    );
  }

  if (inCart) {
    return (
      <button
        type="button"
        onClick={openCart}
        className={buttonClasses({ variant: "success", size: sizeName, fullWidth })}
        aria-label={`${product.title} is in your cart. View cart`}
      >
        <Check className="size-4" aria-hidden="true" /> In cart
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        openCart();
      }}
      className={buttonClasses({ variant: "primary", size: sizeName, fullWidth })}
      aria-label={`Add ${product.title} to cart`}
    >
      {size === "lg" ? <ShoppingBag className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
      Add to cart
    </button>
  );
}
