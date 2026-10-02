"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOverlay } from "@/hooks/useOverlay";
import Logo from "./Logo";
import { getInitials } from "./AccountMenu";
import { mainLinks, shopLinks } from "./NavMenu";

const pageLinks = mainLinks.filter((link) => !link.children);
const rowClass =
  "flex items-center justify-between rounded-lg px-2 py-3 text-[15px] text-ink transition hover:bg-canvas";

export default function MobileMenu({ open, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  useOverlay(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.nav
            aria-label="Mobile"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-cream"
                aria-label="Close menu"
                autoFocus
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Menu</p>
              <ul className="mt-2">
                {pageLinks.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`${rowClass} ${isActive ? "font-semibold" : ""}`}
                      >
                        {link.label}
                        <ChevronRight className="size-4 text-muted" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Shop</p>
              <ul className="mt-2">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onClose} className={rowClass}>
                      {link.label}
                      <ChevronRight className="size-4 text-muted" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-2 py-3 text-[15px] font-medium text-accent transition hover:bg-canvas"
                  >
                    Sell with us
                    <ChevronRight className="size-4" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="border-t border-line p-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                    aria-label="Log out"
                  >
                    <LogOut className="size-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="rounded-full border border-line py-3 text-center text-sm font-medium transition hover:border-ink"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="rounded-full bg-ink py-3 text-center text-sm font-medium text-white transition hover:bg-ink-soft"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}
