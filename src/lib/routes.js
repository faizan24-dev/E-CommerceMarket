/** URL builders, so every link to the same place is written the same way. */

export function productsUrl({ q, category, sort, page, featured } = {}) {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (featured) params.set("featured", "1");
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export const productUrl = (slug) => `/products/${slug}`;
export const storeUrl = (storeSlug) => `/sellers/${storeSlug}`;
export const orderUrl = (orderId) => `/account/orders/${orderId}`;
export const downloadUrl = (productId) => `/api/downloads/${productId}`;

export function loginUrl(next) {
  return next && next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login";
}

export function signupUrl(next) {
  return next && next !== "/" ? `/signup?next=${encodeURIComponent(next)}` : "/signup";
}
