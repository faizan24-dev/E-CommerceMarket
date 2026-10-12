import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { productsUrl, productUrl } from "@/lib/routes";

/** Two wide cards: the admin's featured picks and the newest free download. Either may be absent. */
export default function CuratedCollections({ staffPicks, freebie }) {
  if (!staffPicks.length && !freebie) return null;

  return (
    <section aria-labelledby="collections-title" className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
      <SectionHeading
        eyebrow="Collections"
        title="Curated for you"
        titleId="collections-title"
        description="Staff picks from our curators and a free download to try."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {staffPicks.length > 0 && (
          <article className="flex flex-col justify-between gap-8 rounded-3xl border border-line bg-white p-7 sm:p-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">Staff picks</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                The products our curators keep recommending
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                Reviewed by our team for craft, usefulness and clear documentation.
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex -space-x-3">
                {staffPicks.map((item) => (
                  <Link
                    key={item.id}
                    href={productUrl(item.slug)}
                    className="relative size-14 overflow-hidden rounded-xl border-2 border-white bg-cream shadow-sm"
                    title={item.title}
                  >
                    {item.coverUrl && <Image src={item.coverUrl} alt={item.title} fill sizes="56px" className="object-cover" />}
                  </Link>
                ))}
              </div>
              <Button href={productsUrl({ featured: true })} iconRight={ArrowRight}>
                See staff picks
              </Button>
            </div>
          </article>
        )}

        {freebie && (
          <article className="grid overflow-hidden rounded-3xl border border-line bg-cream sm:grid-cols-[1fr_0.8fr]">
            <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
              <div>
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                  Free download
                </span>
                <h3 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{freebie.title}</h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
                  Add it to your cart and check out for free. It stays in your library for good.
                </p>
                <p className="mt-4 text-xs text-muted">{freebie.fileType}</p>
              </div>
              <Button href={productUrl(freebie.slug)} icon={Download} className="w-fit">
                Get free download
              </Button>
            </div>
            <div className="relative hidden min-h-full sm:block">
              {freebie.coverUrl && (
                <Image src={freebie.coverUrl} alt={freebie.title} fill sizes="(min-width: 1024px) 22vw, 40vw" className="object-cover" />
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
