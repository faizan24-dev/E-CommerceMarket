"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Lock, ShoppingBag, Trash2, X } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useOverlay } from "@/hooks/useOverlay";
import { api } from "@/lib/apiClient";
import { formatPrice } from "@/lib/format";
import { loginUrl, orderUrl, productUrl } from "@/lib/routes";
import { useAuthStore } from "@/store/authStore";
import { getCartTotal, useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

function CartLine({ item, onNavigate, onRemove }) {
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={productUrl(item.slug)}
        onClick={onNavigate}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream"
      >
        {item.coverUrl && <Image src={item.coverUrl} alt={item.title} fill sizes="80px" className="object-cover" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={productUrl(item.slug)}
            onClick={onNavigate}
            className="text-sm font-medium leading-snug text-ink hover:underline"
          >
            {item.title}
          </Link>
          <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {item.fileType}
          {item.storeName && ` | by ${item.storeName}`}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 text-xs text-success">
            <Download className="size-3.5" aria-hidden="true" /> Digital download
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted transition hover:bg-canvas hover:text-danger"
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const markOwned = useAuthStore((state) => state.markOwned);
  const items = useCartStore((state) => state.items);
  const { removeItem, removeItems, clear } = useCartStore.getState();
  const itemCount = items.length;
  const subtotal = getCartTotal(items);
  const isCartOpen = useUiStore((state) => state.isCartOpen);
  const closeCart = useUiStore((state) => state.closeCart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    closeCart();
    setError("");
  }

  useOverlay(isCartOpen, handleClose);

  async function handleCheckout() {
    if (!user) {
      handleClose();
      router.push(loginUrl(pathname));
      return;
    }

    setIsProcessing(true);
    setError("");
    try {
      const { order } = await api.post("/orders", { productIds: items.map((item) => item.id) });
      clear();
      if (order.status === "paid") markOwned(order.items.map((item) => item.productId));
      handleClose();
      router.push(orderUrl(order.id));
    } catch (caught) {
      // Drop items the server says can't be bought (unpublished, already owned), then explain why.
      const unavailable = caught.details?.unavailableProductIds ?? [];
      if (unavailable.length) removeItems(unavailable);
      setError(caught.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <h2 id="cart-title" className="font-serif text-xl">
                Your cart{itemCount > 0 && <span className="ml-1.5 text-base text-muted">({itemCount})</span>}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 transition hover:bg-cream"
                aria-label="Close cart"
                autoFocus
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {error && (
              <div className="px-5 pt-4">
                <Alert tone="error">{error}</Alert>
              </div>
            )}

            {items.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                description="Discover templates, e-books and software from independent creators."
                className="flex-1 justify-center"
                action={
                  <Button href="/products" onClick={handleClose}>
                    Browse products
                  </Button>
                }
              />
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {items.map((item) => (
                    <CartLine key={item.id} item={item} onNavigate={handleClose} onRemove={removeItem} />
                  ))}
                </ul>

                <div className="shrink-0 border-t border-line bg-white px-5 pb-6 pt-4">
                  <dl className="flex justify-between text-base font-semibold">
                    <dt>Total</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </dl>
                  <Button
                    onClick={handleCheckout}
                    isLoading={isProcessing}
                    icon={Lock}
                    fullWidth
                    className="mt-4 h-12"
                  >
                    {isProcessing ? "Placing order..." : user ? `Checkout | ${formatPrice(subtotal)}` : "Log in to checkout"}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted">
                    Final prices are confirmed at checkout. Files unlock once payment is verified.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
