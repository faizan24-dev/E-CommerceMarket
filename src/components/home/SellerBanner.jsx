import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sellerImage } from "@/data/mockData";

const perks = ["Keep 90% of every sale", "Automatic file delivery", "Payouts every week"];

export default function SellerBanner() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="grid overflow-hidden rounded-3xl bg-ink text-white lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">For creators</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
            Turn your craft into a <em className="font-normal text-accent-soft">digital storefront.</em>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            Sell templates, apps, e-books and graphics to buyers who value quality. We handle checkout,
            hosting and delivery, so you can keep creating.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-white/85">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent-soft" aria-hidden="true" />
                {perk}
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-cream"
          >
            Open your shop <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="relative min-h-64 lg:min-h-full">
          <Image
            src={sellerImage}
            alt="A creator working across multiple screens"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
