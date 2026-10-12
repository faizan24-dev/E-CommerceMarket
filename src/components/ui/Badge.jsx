import { EARNING_STATUS, ORDER_STATUS, PRODUCT_STATUS } from "@/config/marketplace";

const TONES = {
  neutral: "border-line bg-canvas text-ink-soft",
  success: "border-success/20 bg-success/5 text-success",
  warning: "border-warning/20 bg-warning/5 text-warning",
  info: "border-info/20 bg-info/5 text-info",
  danger: "border-danger/20 bg-danger/5 text-danger",
  accent: "border-accent/20 bg-accent-soft text-accent",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const STATUS_MAPS = { product: PRODUCT_STATUS, order: ORDER_STATUS, earning: EARNING_STATUS };

/** A status badge whose label and color come from src/config/marketplace.js. */
export function StatusBadge({ type, status }) {
  const config = STATUS_MAPS[type]?.[status];
  return <Badge tone={config?.tone ?? "neutral"}>{config?.label ?? status}</Badge>;
}
