"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CircleCheck, Download, Loader2, Lock, ShoppingBag, Trash2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BUNDLE_DISCOUNT_RATE, BUNDLE_MIN_ITEMS, useCart } from "@/context/CartContext";
import { useOverlay } from "@/hooks/useOverlay";
import { formatPrice } from "@/lib/catalog";

const simulateCheckout = () => new Promise((resolve) => setTimeout(resolve, 900));

function BundleProgress({ itemCount, itemsUntilBundle, qualifiesForBundle }) {
  const progress = Math.min(itemCount / BUNDLE_MIN_ITEMS, 1) * 100;
  const percent = Math.round(BUNDLE_DISCOUNT_RATE * 100);
  return (
    <div className="border-b border-line bg-canvas px-5 py-3.5">
      <p className="text-[13px] text-ink">
        {qualifiesForBundle ? (
          <>
            You&apos;ve unlocked <span className="font-semibold">{percent}% bundle savings</span>.
          </>
        ) : (
          <>
            Add <span className="font-semibold">{itemsUntilBundle}</span> more{" "}
            {itemsUntilBundle === 1 ? "item" : "items"} to save {percent}% on your bundle.
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const cart = useCart();
  const { items, itemCount, subtotal, discount, total, isCartOpen, closeCart, removeItem, clearCart } = cart;
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);

  function handleClose() {
    closeCart();
    setOrder(null);
  }

  useOverlay(isCartOpen, handleClose);

  async function handleCheckout() {
    if (!user) {
      handleClose();
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsProcessing(true);
    await simulateCheckout();
    setOrder({ count: itemCount, total, email: user.email });
    clearCart();
    setIsProcessing(false);
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
                <X className="size-5" />
              </button>
            </div>

            {order ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
                  <CircleCheck className="size-7" />
                </span>
                <h3 className="mt-5 font-serif text-2xl">Order confirmed</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {order.count} {order.count === 1 ? "item" : "items"} for {formatPrice(order.total)}. A receipt
                  would be sent to <span className="font-medium text-ink">{order.email}</span>.
                </p>
                <p className="mt-4 rounded-lg bg-canvas px-4 py-3 text-xs text-muted">
                  This is a demo checkout. No payment was taken and no files are delivered.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft"
                >
                  Continue shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-cream">
                  <ShoppingBag className="size-6 text-muted" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-serif text-2xl">Your cart is empty</h3>
                <p className="mt-2 text-sm text-muted">
                  Discover templates, software and e-books ready to download in seconds.
                </p>
                <Link
                  href="/products"
                  onClick={handleClose}
                  className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <>
                <BundleProgress {...cart} />
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${item.id}`}
                        onClick={handleClose}
                        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream"
                      >
                        <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/products/${item.id}`}
                            onClick={handleClose}
                            className="text-sm font-medium leading-snug text-ink hover:underline"
                          >
                            {item.title}
                          </Link>
                          <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {item.fileType} · by {item.seller}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <Download className="size-3.5" /> Instant download
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted transition hover:bg-canvas hover:text-danger"
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="shrink-0 border-t border-line bg-white px-5 pb-6 pt-4">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Subtotal</dt>
                      <dd>{formatPrice(subtotal)}</dd>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <dt>Bundle savings</dt>
                        <dd>−{formatPrice(discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                      <dt>Total</dt>
                      <dd>{formatPrice(total)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-white transition hover:bg-ink-soft disabled:cursor-wait disabled:opacity-80"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Processing…
                      </>
                    ) : user ? (
                      <>
                        <Lock className="size-4" /> Checkout · {formatPrice(total)}
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" /> Log in to checkout
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">
                    Secure checkout · Files available immediately after purchase
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
