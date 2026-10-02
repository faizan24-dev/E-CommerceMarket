import Link from "next/link";
import { Star } from "lucide-react";
import { testimonials } from "@/data/mockData";
import { getProductById, getStoreStats } from "@/lib/catalog";
import SectionHeading from "./SectionHeading";

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-4 ${n <= rating ? "fill-ink text-ink" : "text-line"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function Testimonials() {
  const stats = getStoreStats();

  return (
    <section id="reviews" className="scroll-mt-32 border-t border-line">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Reviews"
            title="Loved by creators everywhere"
            description="Real words from people who design, write, build and sell with products from our shelves."
          />
          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-white px-5 py-3">
            <span className="font-serif text-3xl text-ink">{stats.averageRating.toFixed(1)}</span>
            <div>
              <Stars rating={5} />
              <p className="mt-1 text-xs text-muted">
                from {stats.totalReviews.toLocaleString("en-US")} reviews
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((review) => {
            const product = getProductById(review.productId);
            return (
              <li key={review.id}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(28,27,25,0.35)] motion-reduce:hover:translate-y-0 sm:p-7">
                  <Stars rating={review.rating} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-semibold text-ink"
                      aria-hidden="true"
                    >
                      {initials(review.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{review.name}</p>
                      <p className="truncate text-xs text-muted">
                        {review.role}
                        {product && (
                          <>
                            {" · "}
                            <Link href={`/products/${product.id}`} className="underline-offset-2 hover:text-ink hover:underline">
                              {product.title}
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
