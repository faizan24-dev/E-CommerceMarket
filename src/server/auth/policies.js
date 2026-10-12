/*
 * Authorization rules in one place. Every function takes the plain user object
 * returned by getCurrentUser() (or null).
 */

export function isAdmin(user) {
  return user?.role === "admin" && user.status === "active";
}

export function isActiveSeller(user) {
  return Boolean(user && user.status === "active" && user.seller?.status === "active");
}

/** Admins can sell too: their products are published without review and carry no commission. */
export function canSell(user) {
  return isAdmin(user) || isActiveSeller(user);
}

export function ownsProduct(user, product) {
  return Boolean(user && product && String(product.seller?._id ?? product.seller) === String(user._id));
}

export function canManageProduct(user, product) {
  return isAdmin(user) || (isActiveSeller(user) && ownsProduct(user, product));
}
