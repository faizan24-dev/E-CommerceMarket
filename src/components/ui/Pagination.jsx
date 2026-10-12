import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Previous/next links. `hrefForPage(n)` builds the URL for page n. */
export default function Pagination({ page, pageCount, hrefForPage }) {
  if (pageCount <= 1) return null;
  const linkClass =
    "inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink transition hover:border-ink";
  const disabledClass = "inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm text-muted/60";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefForPage(page - 1)} className={linkClass} rel="prev">
          <ChevronLeft className="size-4" aria-hidden="true" /> Previous
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ChevronLeft className="size-4" /> Previous
        </span>
      )}
      <p className="text-sm text-muted">
        Page {page} of {pageCount}
      </p>
      {page < pageCount ? (
        <Link href={hrefForPage(page + 1)} className={linkClass} rel="next">
          Next <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          Next <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
