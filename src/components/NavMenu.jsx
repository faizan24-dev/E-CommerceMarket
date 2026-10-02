"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { categories } from "@/data/mockData";

// ---- Navigation data (shared with the mobile menu) ---------------------------

export const shopLinks = [
  { label: "New Arrivals", href: "/products", description: "The latest drops across every category" },
  ...categories.map((category) => ({
    label: category.name,
    href: `/products?category=${category.slug}`,
    description: category.tagline,
  })),
];

export const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", children: shopLinks },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

function isSectionActive(href, pathname) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// Text style shared by every top-level item; the underline grows on hover and stays when active.
function itemClass(isActive) {
  return `relative inline-flex items-center gap-1 py-2 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100 ${
    isActive ? "font-semibold text-ink after:scale-x-100" : "text-ink-soft after:scale-x-0"
  }`;
}

// ---- Shop dropdown -----------------------------------------------------------

function ShopMenu({ isActive, activeShopHref }) {
  const panelId = useId();
  const buttonRef = useRef(null);
  const closeTimer = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function openMenu() {
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  }

  // A short delay lets the pointer travel from the button to the panel without it closing.
  function closeMenuSoon() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  }

  function closeMenu() {
    clearTimeout(closeTimer.current);
    setIsOpen(false);
  }

  return (
    <li
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuSoon}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          closeMenu();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={itemClass(isActive)}
      >
        Shop
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* pt-4 is an invisible bridge between the button and the panel for the hover path. */}
      <div
        id={panelId}
        className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-4 transition duration-200 ease-out ${
          isOpen ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_24px_50px_-20px_rgba(28,27,25,0.3)]">
          <ul>
            {shopLinks.map((link) => {
              const isCurrent = link.href === activeShopHref;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-canvas ${
                      isCurrent ? "bg-canvas" : ""
                    }`}
                  >
                    <span className={`block text-sm text-ink ${isCurrent ? "font-semibold" : "font-medium"}`}>
                      {link.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{link.description}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/products"
            onClick={closeMenu}
            className="mt-1 flex items-center justify-between rounded-xl border-t border-line px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-canvas"
          >
            Shop all products <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </li>
  );
}

// ---- Desktop navigation ------------------------------------------------------

function NavList({ pathname, category }) {
  const activeShopHref =
    pathname === "/products" ? (category ? `/products?category=${category}` : "/products") : null;

  return (
    <ul className="flex items-center gap-8 xl:gap-10">
      {mainLinks.map((link) => {
        const isActive = pathname !== null && isSectionActive(link.href, pathname);
        if (link.children) {
          return <ShopMenu key={link.label} isActive={isActive} activeShopHref={activeShopHref} />;
        }
        return (
          <li key={link.label}>
            <Link href={link.href} aria-current={isActive ? "page" : undefined} className={itemClass(isActive)}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Reads the URL to highlight the current page and category. Rendered inside a
// Suspense boundary so useSearchParams doesn't opt every page out of static rendering.
function ActiveNavList() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <NavList pathname={pathname} category={searchParams.get("category")} />;
}

export function NavListFallback() {
  return <NavList pathname={null} category={null} />;
}

export default ActiveNavList;
