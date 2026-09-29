"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";
import { categories } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import AccountMenu from "./AccountMenu";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";

export const navLinks = [
  { label: "New Arrivals", href: "/products" },
  ...categories.map((category) => ({
    label: category.name,
    href: `/products?category=${category.slug}`,
  })),
];

const iconClass = "size-5";

function subscribeToScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
const getIsScrolled = () => window.scrollY > 8;
const getServerIsScrolled = () => false;

function NavLinkList({ activeHref }) {
  return (
    <ul className="flex items-center gap-5 xl:gap-9">
      {navLinks.map((link) => {
        const isActive = link.href === activeHref;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative py-2 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 ${
                isActive ? "text-ink after:scale-x-100" : "text-ink-soft after:scale-x-0"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Reads the URL to underline the current category. Kept in its own Suspense
// boundary so useSearchParams doesn't opt every page out of static rendering.
function ActiveNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const activeHref =
    pathname === "/products" ? (category ? `/products?category=${category}` : "/products") : null;
  return <NavLinkList activeHref={activeHref} />;
}

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
            <Suspense fallback={<NavLinkList activeHref={null} />}>
              <ActiveNavLinks />
            </Suspense>
          </nav>

          <div className="-mr-2 flex items-center justify-end gap-0.5 sm:gap-1.5">
            <HeaderSearch className="mr-3 hidden w-52 md:block lg:mr-2 lg:w-36 xl:mr-4 xl:w-52 2xl:w-60" />
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

      <MobileMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} links={navLinks} />
    </>
  );
}
