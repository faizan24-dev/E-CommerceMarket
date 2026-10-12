/*
 * Data transfer objects: the only shapes that leave the server layer.
 *
 * Mongoose documents carry ObjectIds, Dates and private fields (password
 * hashes, private file ids, encrypted bank details). These mappers turn them
 * into plain, serializable objects that are safe to send to the browser or
 * pass to Client Components.
 */

const id = (value) => (value ? String(value._id ?? value) : null);
const iso = (date) => (date ? new Date(date).toISOString() : null);

export function toUserDTO(user) {
  if (!user) return null;
  return {
    id: id(user),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    seller: user.seller
      ? {
          status: user.seller.status,
          storeName: user.seller.storeName,
          storeSlug: user.seller.storeSlug,
          bio: user.seller.bio ?? "",
          joinedAt: iso(user.seller.joinedAt),
          hasPayoutMethod: Boolean(user.seller.payoutMethod),
        }
      : null,
    createdAt: iso(user.createdAt),
  };
}

/** Public seller info shown on product pages and storefronts. */
export function toSellerSummaryDTO(user) {
  if (!user) return null;
  return {
    id: id(user),
    storeName: user.seller?.storeName ?? user.name,
    storeSlug: user.seller?.storeSlug ?? null,
  };
}

/** Masked payout method: enough for the seller to recognize it, nothing an attacker could use. */
export function toPayoutMethodDTO(method, { accountNumber } = {}) {
  if (!method) return null;
  return {
    type: method.type,
    accountHolder: method.accountHolder,
    provider: method.provider,
    accountLast4: method.accountLast4,
    notes: method.notes ?? "",
    updatedAt: iso(method.updatedAt),
    // Only included for admins preparing a payout.
    ...(accountNumber !== undefined && { accountNumber }),
  };
}

export function toProductDTO(product) {
  const seller = product.seller && typeof product.seller === "object" && "name" in product.seller ? product.seller : null;
  return {
    id: id(product),
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    fileType: product.fileType,
    includes: product.includes ?? [],
    tag: product.tag ?? null,
    coverUrl: product.coverImage?.url ?? null,
    hasFile: Boolean(product.file?.fileId),
    seller: seller ? toSellerSummaryDTO(seller) : { id: id(product.seller), storeName: null, storeSlug: null },
    status: product.status,
    reviewNote: product.reviewNote ?? null,
    isFeatured: Boolean(product.isFeatured),
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    salesCount: product.salesCount ?? 0,
    createdAt: iso(product.createdAt),
    updatedAt: iso(product.updatedAt),
  };
}

/** Product details for its owner or an admin, including the private file's name and size. */
export function toManagedProductDTO(product) {
  return {
    ...toProductDTO(product),
    file: product.file?.fileId
      ? { filename: product.file.filename, size: product.file.size, contentType: product.file.contentType }
      : null,
  };
}

export function toOrderDTO(order) {
  const buyer = order.buyer && typeof order.buyer === "object" && "email" in order.buyer ? order.buyer : null;
  return {
    id: id(order),
    number: order.number,
    status: order.status,
    total: order.total,
    currency: order.currency,
    items: order.items.map((item) => ({
      productId: id(item.product),
      sellerId: id(item.seller),
      title: item.title,
      slug: item.slug,
      coverUrl: item.coverUrl ?? null,
      fileType: item.fileType ?? null,
      price: item.price,
      commission: item.commission,
      sellerEarning: item.sellerEarning,
    })),
    payment: {
      method: order.payment?.method,
      reference: order.payment?.reference ?? null,
      submittedAt: iso(order.payment?.submittedAt),
      confirmedAt: iso(order.payment?.confirmedAt),
    },
    buyer: buyer ? { id: id(buyer), name: buyer.name, email: buyer.email } : { id: id(order.buyer) },
    paidAt: iso(order.paidAt),
    cancelledAt: iso(order.cancelledAt),
    cancelReason: order.cancelReason ?? null,
    createdAt: iso(order.createdAt),
  };
}

export function toEarningDTO(earning) {
  return {
    id: id(earning),
    orderNumber: earning.orderNumber,
    productId: id(earning.product),
    productTitle: earning.productTitle,
    gross: earning.gross,
    commission: earning.commission,
    net: earning.net,
    status: earning.status,
    payoutId: id(earning.payout),
    earnedAt: iso(earning.earnedAt),
  };
}

export function toPayoutDTO(payout) {
  const seller = payout.seller && typeof payout.seller === "object" && "name" in payout.seller ? payout.seller : null;
  return {
    id: id(payout),
    amount: payout.amount,
    earningsCount: payout.earningsCount,
    method: payout.method?.type ? { ...payout.method } : null,
    reference: payout.reference,
    note: payout.note ?? "",
    paidAt: iso(payout.paidAt),
    seller: seller ? { id: id(seller), name: seller.name, ...toSellerSummaryDTO(seller) } : { id: id(payout.seller) },
  };
}

export function toSessionDTO(session, currentSessionId) {
  return {
    id: id(session),
    userAgent: session.userAgent,
    ip: session.ip,
    createdAt: iso(session.createdAt),
    lastSeenAt: iso(session.lastSeenAt),
    isCurrent: String(session._id) === String(currentSessionId),
  };
}
