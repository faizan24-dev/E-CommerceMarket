import { CATEGORIES } from "./categories";

export const SITE_NAME = "Ecommerce Market";
export const SITE_TAGLINE = "Instant Digital Downloads";
export const SITE_DESCRIPTION =
  "Ecommerce Market is a curated marketplace for digital products: templates, e-books, software and vector packs from independent creators.";

/** Shop dropdown entries (desktop) and Shop section (mobile menu). */
export const SHOP_LINKS = [
  { label: "New Arrivals", href: "/products", description: "The latest drops across every category" },
  ...CATEGORIES.map((category) => ({
    label: category.name,
    href: `/products?category=${category.slug}`,
    description: category.tagline,
  })),
];

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", children: SHOP_LINKS },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      ...CATEGORIES.map((category) => ({ label: category.name, href: `/products?category=${category.slug}` })),
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My library", href: "/account" },
      { label: "Orders", href: "/account/orders" },
      { label: "Sell on Ecommerce Market", href: "/sell" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Customer reviews", href: "/#reviews" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
];
