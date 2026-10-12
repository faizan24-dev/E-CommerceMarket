import Link from "next/link";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-ink text-white hover:bg-ink-soft",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:bg-cream",
  inverse: "bg-white text-ink hover:bg-cream",
  danger: "bg-danger text-white hover:bg-danger/90",
  "danger-outline": "border border-danger/30 bg-white text-danger hover:bg-danger/5",
  success: "border border-success/30 bg-success/5 text-success hover:bg-success/10",
};

const SIZES = {
  sm: "h-9 gap-1.5 px-3.5 text-[13px]",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-6 text-[15px]",
};

export function buttonClasses({ variant = "primary", size = "md", fullWidth = false, className = "" } = {}) {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full font-medium transition",
    "disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]",
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");
}

/**
 * The single button style used across the site. Renders a Next.js Link when
 * `href` is given. `icon` is a lucide component shown before the label and
 * replaced by a spinner while `isLoading`.
 */
export default function Button({
  href,
  variant,
  size,
  fullWidth,
  className,
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  disabled,
  type = "button",
  children,
  ...props
}) {
  const classes = buttonClasses({ variant, size, fullWidth, className });
  const content = (
    <>
      {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : Icon && <Icon className="size-4" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="size-4" aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
      {content}
    </button>
  );
}
