import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import { formatPrice } from "@/lib/format";
import { productUrl } from "@/lib/routes";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, priority = false }) {
  const href = productUrl(product.slug);

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-cream">
        {product.coverUrl && (
          <Image
            src={product.coverUrl}
            alt={product.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm">
            {product.tag}
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-md bg-ink/75 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {product.fileType}
        </span>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-muted">{product.seller?.storeName}</p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug text-ink">
          <Link href={href} className="hover:underline hover:underline-offset-2">
            {product.title}
          </Link>
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-1.5" />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}

/** The standard responsive product grid. */
export function ProductGrid({ products, priorityCount = 0, className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < priorityCount} />
      ))}
    </div>
  );
}
