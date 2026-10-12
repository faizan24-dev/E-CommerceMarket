import Link from "next/link";
import { SITE_NAME } from "@/config/site";

export default function Logo({ className = "", onClick }) {
  const [first, ...rest] = SITE_NAME.split(" ");
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center whitespace-nowrap ${className}`}
      aria-label={`${SITE_NAME} home`}
    >
      <span className="text-[15px] font-semibold tracking-tight text-ink sm:text-base">
        {first} <span className="font-normal text-muted">{rest.join(" ")}</span>
      </span>
    </Link>
  );
}
