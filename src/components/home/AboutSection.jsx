import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { aboutValues } from "@/content/home";
import { aboutImage } from "@/content/images";
import { formatCompact } from "@/lib/format";

/** Split layout: editorial image on one side, brand story, values and live catalog numbers on the other. */
export default function AboutSection({ stats, showLink = true }) {
  const metrics = [
    { value: stats.productCount, label: "Digital products" },
    { value: `${formatCompact(stats.totalReviews)}+`, label: "Verified reviews" },
    { value: stats.averageRating ? stats.averageRating.toFixed(1) : "New", label: "Average rating" },
    { value: stats.categoryCount, label: "Categories" },
  ];

  return (
    <section id="about" className="scroll-mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand lg:aspect-[4/5]">
          <Image
            src={aboutImage}
            alt="A creator sketching ideas at a sunlit desk"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">About us</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            A marketplace built for people who make things.
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              Ecommerce Market started with a simple idea: buying a template or an e-book should feel as considered as
              shopping in a well-run design store, not like digging through a download site.
            </p>
            <p>
              We work with independent creators to bring you tools that are thoughtfully made, clearly described and
              ready the moment you need them.
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {aboutValues.map((value) => (
              <li key={value.title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink">
                  <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{value.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">{value.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="sr-only">{metric.label}</dt>
                <dd className="font-serif text-4xl tracking-tight text-ink">{metric.value}</dd>
                <dd className="mt-1 text-xs text-muted">{metric.label}</dd>
              </div>
            ))}
          </dl>

          {showLink && (
            <Button href="/about" iconRight={ArrowRight} className="mt-10">
              Read our story
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
