import Link from "next/link";

export default function Logo({ className = "", onClick }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-2 whitespace-nowrap ${className}`}
      aria-label="Ecommerce Market home"
    >
      <span
        className="flex size-7 items-center justify-center rounded-lg bg-ink font-serif text-base font-semibold italic leading-none text-white transition group-hover:bg-accent"
        aria-hidden="true"
      >
        e
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-ink sm:text-base">
        Ecommerce <span className="font-normal text-muted">Market</span>
      </span>
    </Link>
  );
}
