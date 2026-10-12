/*
 * Marketplace business rules. Safe to import from client and server code.
 * Environment-specific values (secrets, database, payment mode) live in
 * src/server/config/env.js instead.
 */

/** Share of every sale the platform keeps. Stored on each order item, so changing it never rewrites history. */
export const COMMISSION_RATE = 0.1;

export const CURRENCY = "USD";

/** Seller products wait for admin approval before they appear in the shop. */
export const REQUIRE_PRODUCT_REVIEW = true;

export const PRICE_MAX_CENTS = 1_000_000_00;

export const UPLOAD_LIMITS = {
  // Note: Vercel caps serverless request bodies at about 4.5 MB in total.
  productFile: { maxBytes: 20 * 1024 * 1024, kinds: ["pdf", "zip"], accept: ".pdf,.zip" },
  coverImage: { maxBytes: 4 * 1024 * 1024, kinds: ["jpeg", "png", "webp"], accept: ".jpg,.jpeg,.png,.webp" },
};

export const FILE_KIND_LABELS = {
  pdf: "PDF",
  zip: "ZIP archive",
  jpeg: "JPEG image",
  png: "PNG image",
  webp: "WebP image",
};

export const PRODUCT_STATUS = {
  pending: { label: "In review", tone: "warning" },
  published: { label: "Published", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  archived: { label: "Archived", tone: "neutral" },
};

export const ORDER_STATUS = {
  pending_payment: { label: "Awaiting payment", tone: "warning" },
  awaiting_confirmation: { label: "Payment submitted", tone: "info" },
  paid: { label: "Paid", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const EARNING_STATUS = {
  unpaid: { label: "Unpaid", tone: "warning" },
  paid: { label: "Paid out", tone: "success" },
};

export const PAYOUT_METHOD_TYPES = {
  bank_transfer: { label: "Bank transfer", providerLabel: "Bank name", accountLabel: "Account number or IBAN" },
  mobile_wallet: { label: "Mobile wallet", providerLabel: "Wallet provider", accountLabel: "Wallet number" },
  paypal: { label: "PayPal", providerLabel: "Provider", accountLabel: "PayPal email" },
};

export function calculateCommission(priceCents, rate = COMMISSION_RATE) {
  const commission = Math.round(priceCents * rate);
  return { commission, sellerEarning: priceCents - commission };
}
