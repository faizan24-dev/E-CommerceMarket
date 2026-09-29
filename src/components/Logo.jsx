import Link from "next/link";

export default function Logo({ className = "", onClick }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center whitespace-nowrap ${className}`}
      aria-label="Ecommerce Market home"
    >
      <span className="text-[15px] font-semibold tracking-tight text-ink sm:text-base">
        Ecommerce <span className="font-normal text-muted">Market</span>
      </span>
    </Link>
  );
}
