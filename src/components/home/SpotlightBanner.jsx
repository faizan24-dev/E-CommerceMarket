import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { spotlightProductId } from "@/data/mockData";
import { formatPrice, getProductById } from "@/lib/catalog";

/** Curator's Choice: split card with a large product image and the key details. */
export default function SpotlightBanner() {
  const product = getProductById(spotlightProductId);
  const fullStars = Math.round(product.rating);

  return (
    <section aria-label="Curator's choice" className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-2">
        <Link href={`/products/${product.id}`} className="group relative block aspect-[4/3] bg-cream lg:aspect-auto lg:min-h-[30rem]">
          <Image
            src={product.image}
            alt={`${product.title} preview`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <span className="inline-flex w-fit items-center rounded-full border border-line bg-canvas px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            Editor&apos;s Pick
          </span>
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            {product.title}
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-0.5" role="img" aria-label={`Rated ${product.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`size-4 ${n <= fullStars ? "fill-ink text-ink" : "text-line"}`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString("en-US")} reviews
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">{product.description}</p>

          <ul className="mt-6 space-y-2.5">
            {product.includes.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <span className="flex size-5 items-center justify-center rounded-full bg-cream">
                  <Check className="size-3 text-ink" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href={`/products/${product.id}`}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-white transition hover:bg-ink-soft"
          >
            View Product <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
