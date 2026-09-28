import { categories, products } from "@/data/mockData";

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
  return currency.format(amount);
}
