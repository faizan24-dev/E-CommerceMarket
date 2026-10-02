import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { freebieProductId } from "@/data/mockData";
import { formatPrice, getBundle, getProductById } from "@/lib/catalog";
import SectionHeading from "./SectionHeading";

/** Two wide cards: a product bundle and the weekly free download. */
export default function CuratedCollections() {
  const bundle = getBundle("studio-starter");
  const freebie = getProductById(freebieProductId);

  return (
    <section aria-labelledby="collections-title" className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
      <SectionHeading
        eyebrow="Collections"
        title={<span id="collections-title">Curated for you</span>}
        description="Hand-picked bundles and a free download every week."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Bundle */}
        <article className="flex flex-col justify-between gap-8 rounded-3xl border border-line bg-white p-7 sm:p-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Bundle · {bundle.items.length} products
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{bundle.title}</h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{bundle.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex -space-x-3">
                {bundle.items.map((item) => (
                  <span
                    key={item.id}
                    className="relative size-14 overflow-hidden rounded-xl border-2 border-white bg-cream shadow-sm"
                    title={item.title}
                  >
                    <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                <span className="mr-2 line-through">{formatPrice(bundle.total)}</span>
                <span className="text-lg font-semibold text-ink">{formatPrice(bundle.bundlePrice)}</span>
                <span className="ml-2 text-xs text-success">Save 10%</span>
              </p>
            </div>
            <Link
              href={`/products?bundle=${bundle.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft"
            >
              Explore Bundle <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>

        {/* Weekly freebie */}
        <article className="grid overflow-hidden rounded-3xl border border-line bg-cream sm:grid-cols-[1fr_0.8fr]">
          <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
            <div>
              <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                Free this week
              </span>
              <h3 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                Weekly Digital Freebie
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
                Download this week&apos;s free template.
              </p>
              <p className="mt-4 text-sm font-medium text-ink">{freebie.title}</p>
              <p className="text-xs text-muted">{freebie.fileType}</p>
            </div>
            <Link
              href={`/products/${freebie.id}`}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft"
            >
              <Download className="size-4" /> Get Free Download
            </Link>
          </div>
          <div className="relative hidden min-h-full sm:block">
            <Image
              src={freebie.image}
              alt={freebie.title}
              fill
              sizes="(min-width: 1024px) 22vw, 40vw"
              className="object-cover"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
