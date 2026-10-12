import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** `items` is a list of `{ label, href? }`; the last item is the current page. Home is added automatically. */
export default function Breadcrumbs({ items, className = "" }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span className={isLast ? "text-ink" : ""} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="size-3" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
