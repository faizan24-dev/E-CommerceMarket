"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import AccountMenu from "./AccountMenu";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";
import ActiveNavList, { NavListFallback } from "./NavMenu";

const iconClass = "size-5";

function subscribeToScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const getIsScrolled = () => window.scrollY > 8;
const getServerIsScrolled = () => false;

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useSyncExternalStore(subscribeToScroll, getIsScrolled, getServerIsScrolled);

  return (
    <>
      <div className="bg-black text-white">
        <div className="relative flex min-h-9 items-center justify-center px-4 py-2 sm:px-6 lg:px-10">
          <p className="text-center text-[11px] sm:text-xs">
            Ecommerce Market <span aria-hidden="true">•</span> Instant Digital Downloads &amp; Secure Delivery
            <span className="hidden md:inline">
              . Explore this week&apos;s new drops{" "}
              <Link href="/products" className="underline underline-offset-2 transition hover:opacity-75">
                right here.
              </Link>
            </span>
          </p>
          <Link
            href="/signup"
            className="absolute right-6 hidden text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:opacity-75 lg:right-10 xl:block"
          >
            Sell with us
          </Link>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b border-line bg-canvas transition-shadow duration-300 ${
          isScrolled ? "shadow-[0_8px_24px_-16px_rgba(28,27,25,0.3)]" : ""
        }`}
      >
        <div
          className={`relative z-10 mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 transition-[height] duration-300 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-10 ${
            isScrolled ? "h-14" : "h-16 lg:h-[72px]"
          }`}
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="-ml-2 rounded-full p-2 text-ink transition hover:bg-cream lg:hidden"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className={iconClass} strokeWidth={1.6} />
            </button>
            <Logo />
          </div>

          <nav aria-label="Main" className="hidden lg:block">
            <Suspense fallback={<NavListFallback />}>
              <ActiveNavList />
            </Suspense>
          </nav>

          <div className="-mr-2 flex items-center justify-end gap-0.5 sm:gap-1.5">
            <HeaderSearch className="mr-3 hidden w-52 md:block lg:mr-2 lg:w-44 xl:mr-4 xl:w-56 2xl:w-60" />
            <AccountMenu iconClassName={iconClass} className="hidden sm:block" />
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full p-2 text-ink transition hover:bg-cream"
              aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            >
              <ShoppingBag className={iconClass} strokeWidth={1.6} />
              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Phones: the search field gets its own row under the logo. */}
        <div className="px-4 pb-3 sm:px-6 md:hidden">
          <HeaderSearch />
        </div>
      </header>

      <MobileMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
