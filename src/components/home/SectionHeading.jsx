import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink"
        >
          <span className="underline decoration-line decoration-2 underline-offset-4 transition group-hover:decoration-ink">
            {action.label}
          </span>
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
