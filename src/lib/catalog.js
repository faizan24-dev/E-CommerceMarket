import { blogPosts, bundles, categories, products } from "@/data/mockData";

export function getProductById(id) {
  return products.find((product) => product.id === id) ?? null;
}

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getCategoryByName(name) {
  return categories.find((category) => category.name === name) ?? null;
}

export function countProductsInCategory(name) {
  return products.filter((product) => product.category === name).length;
}

/**
 * Filters the catalog by a free-text query and an optional category slug.
 * The query matches title, description, category, file type and seller.
 */
export function filterProducts({ query = "", category = "" } = {}) {
  const needle = query.trim().toLowerCase();
  const categoryName = getCategoryBySlug(category)?.name;

  return products.filter((product) => {
    if (categoryName && product.category !== categoryName) return false;
    if (!needle) return true;
    return [product.title, product.description, product.category, product.fileType, product.seller]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(amount) {
  return amount === 0 ? "Free" : currency.format(amount);
}

/** Returns a bundle with its products resolved, plus combined and discounted prices. */
export function getBundle(slug, discountRate = 0.1) {
  const bundle = bundles.find((b) => b.slug === slug);
  if (!bundle) return null;
  const items = bundle.productIds.map(getProductById).filter(Boolean);
  const total = items.reduce((sum, p) => sum + p.price, 0);
  return { ...bundle, items, total, bundlePrice: Math.round(total * (1 - discountRate) * 100) / 100 };
}

// ---- Blog & site stats -------------------------------------------------------

export function getPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(isoDate) {
  return dateFormat.format(new Date(isoDate));
}

/** Store-wide numbers derived from the catalog (used by the About section and reviews). */
export function getStoreStats() {
  const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
  const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
  return {
    productCount: products.length,
    categoryCount: categories.length,
    totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
  };
}
