import { Star } from "lucide-react";

/** Compact rating: one star, the score and the review count. Renders nothing for unrated products. */
export default function StarRating({ rating, reviewCount, className = "" }) {
  if (!reviewCount) return null;
  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      <Star className="size-3.5 fill-ink text-ink" aria-hidden="true" />
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      <span className="text-muted">({reviewCount.toLocaleString("en-US")})</span>
      <span className="sr-only">
        Rated {rating} out of 5 from {reviewCount} reviews
      </span>
    </div>
  );
}

/** Five stars, filled up to the rounded rating. */
export function StarRow({ rating, className = "size-4" }) {
  const filled = Math.round(rating);
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${className} ${n <= filled ? "fill-ink text-ink" : "text-line"}`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
