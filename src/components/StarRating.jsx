import { Star } from "lucide-react";

export default function StarRating({ rating, reviewCount, className = "" }) {
  return (
    <div className={`flex items-center gap-1 text-xs ${className}`}>
      <Star className="size-3.5 fill-ink text-ink" aria-hidden="true" />
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-muted">({reviewCount.toLocaleString("en-US")})</span>
      )}
      <span className="sr-only">
        Rated {rating} out of 5{reviewCount !== undefined ? ` from ${reviewCount} reviews` : ""}
      </span>
    </div>
  );
}
