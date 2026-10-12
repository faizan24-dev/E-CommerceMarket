import { CURRENCY } from "@/config/marketplace";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: CURRENCY });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** Shop prices: amounts are in cents; 0 shows as "Free". */
export function formatPrice(cents) {
  return cents === 0 ? "Free" : currency.format(cents / 100);
}

/** Dashboard amounts: always numeric, e.g. "$0.00". */
export function formatMoney(cents) {
  return currency.format((cents ?? 0) / 100);
}

export function formatDate(value) {
  return value ? dateFormat.format(new Date(value)) : "";
}

export function formatDateTime(value) {
  return value ? dateTimeFormat.format(new Date(value)) : "";
}

export function formatCompact(value) {
  return compact.format(value ?? 0);
}

export function formatFileSize(bytes) {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : plural}`;
}

export function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
