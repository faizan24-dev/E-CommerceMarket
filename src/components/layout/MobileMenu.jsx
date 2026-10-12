"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LogOut, X } from "lucide-react";
import { MAIN_NAV, SHOP_LINKS } from "@/config/site";
import { useLogout } from "@/hooks/useLogout";
import { useOverlay } from "@/hooks/useOverlay";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { getAccountLinks } from "./accountLinks";
import Logo from "./Logo";

const pageLinks = MAIN_NAV.filter((link) => !link.children);
const rowClass = "flex items-center justify-between rounded-lg px-2 py-3 text-[15px] text-ink transition hover:bg-canvas";
const sectionLabelClass = "px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";

function MenuSection({ title, links, onNavigate, pathname }) {
  return (
    <>
      <p className={`mt-6 first:mt-0 ${sectionLabelClass}`}>{title}</p>
      <ul className="mt-2">
        {links.map((link) => {
          const isActive = pathname !== null && (link.href === "/" ? pathname === "/" : pathname === link.href);
          return (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={`${rowClass} ${isActive ? "font-semibold" : ""}`}
              >
                {link.label}
                <ChevronRight className="size-4 text-muted" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function MobileMenu({ open, onClose }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
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
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
              <MenuSection title="Menu" links={pageLinks} onNavigate={onClose} pathname={pathname} />
              <MenuSection title="Shop" links={SHOP_LINKS} onNavigate={onClose} pathname={null} />
              {user && <MenuSection title="Your account" links={getAccountLinks(user)} onNavigate={onClose} pathname={pathname} />}
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
                      onClose();
                      logout();
                    }}
                    className="rounded-full p-2 text-muted transition hover:bg-cream hover:text-ink"
                    aria-label="Log out"
                  >
                    <LogOut className="size-5" aria-hidden="true" />
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
