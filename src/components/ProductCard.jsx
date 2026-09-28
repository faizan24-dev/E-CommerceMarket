import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import AddToCartButton from "./AddToCartButton";
import StarRating from "./StarRating";

export default function ProductCard({ product, priority = false }) {
  const href = `/products/${product.id}`;

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-cream">
        <Image
          src={product.image}
          alt={product.title}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
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
        <p className="text-xs text-muted">{product.seller}</p>
        <h3 className="mt-1 text-[15px] font-medium leading-snug text-ink">
          <Link href={href} className="hover:underline hover:underline-offset-2">
            {product.title}
          </Link>
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-1.5" />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
          <AddToCartButton productId={product.id} productTitle={product.title} />
        </div>
      </div>
    </article>
  );
}
