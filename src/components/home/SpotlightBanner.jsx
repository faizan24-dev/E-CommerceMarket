import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { StarRow } from "@/components/ui/StarRating";
import { formatPrice } from "@/lib/format";
import { productUrl } from "@/lib/routes";

/** Editor's pick: split card with a large product image and the key details. */
export default function SpotlightBanner({ product }) {
  if (!product) return null;
  const href = productUrl(product.slug);

  return (
    <section aria-label="Editor's pick" className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-2">
        <Link href={href} className="group relative block aspect-[4/3] bg-cream lg:aspect-auto lg:min-h-[30rem]">
          {product.coverUrl && (
            <Image
              src={product.coverUrl}
              alt={`${product.title} preview`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}
        </Link>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <span className="inline-flex w-fit items-center rounded-full border border-line bg-canvas px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            Editor&apos;s Pick
          </span>
          <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl lg:text-[44px]">
            {product.title}
          </h2>

          {product.reviewCount > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <StarRow rating={product.rating} />
              <span className="text-sm text-muted">
                {product.rating.toFixed(1)} | {product.reviewCount.toLocaleString("en-US")} reviews
              </span>
            </div>
          )}

          <p className="mt-5 text-3xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-4 line-clamp-4 max-w-lg text-[15px] leading-relaxed text-muted">{product.description}</p>

          {product.includes.length > 0 && (
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
          )}

          <Button href={href} iconRight={ArrowRight} size="lg" className="mt-8 w-fit">
            View product
          </Button>
        </div>
      </div>
    </section>
  );
}
