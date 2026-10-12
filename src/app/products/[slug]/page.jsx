import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Check, Download, FileText, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { getCategory } from "@/config/categories";
import AddToCartButton from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import StarRating from "@/components/ui/StarRating";
import { formatPrice } from "@/lib/format";
import { productsUrl, storeUrl } from "@/lib/routes";
import { preparePageData } from "@/server/page";
import { getPublishedProductBySlug, getRelatedProducts } from "@/server/services/productService";

// Shared by generateMetadata and the page, so the product is fetched once per request.
const getProduct = cache(getPublishedProductBySlug);

export async function generateMetadata({ params }) {
  await preparePageData();
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params }) {
  await preparePageData();
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = await getRelatedProducts(product);

  const details = [
    { icon: FileText, label: "Format", value: product.fileType },
    { icon: Download, label: "Delivery", value: "Download from your library" },
    { icon: InfinityIcon, label: "Access", value: "Lifetime, with updates" },
    { icon: ShieldCheck, label: "Payment", value: "Verified before delivery" },
  ];

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumbs
        items={[{ label: category?.name ?? "Shop", href: productsUrl({ category: category?.slug }) }, { label: product.title }]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
            {product.coverUrl && (
              <Image
                src={product.coverUrl}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            )}
            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow-sm">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted">
            by{" "}
            {product.seller.storeSlug ? (
              <Link href={storeUrl(product.seller.storeSlug)} className="font-medium text-ink hover:underline">
                {product.seller.storeName}
              </Link>
            ) : (
              <span className="font-medium text-ink">{product.seller.storeName}</span>
            )}
            <BadgeCheck className="size-4 text-accent" aria-label="Verified seller" />
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{product.title}</h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-3 text-sm" />
          <p className="mt-6 text-3xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton product={product} size="lg" />
          </div>

          {product.includes.length > 0 && (
            <div className="mt-8 rounded-2xl border border-line bg-white p-5">
              <h2 className="text-sm font-semibold text-ink">What&apos;s included</h2>
              <ul className="mt-3 space-y-2">
                {product.includes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-soft">
                    <Check className="size-4 text-success" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-sm font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">You might also like</h2>
          <ProductGrid products={related} className="mt-8 lg:grid-cols-4" />
        </section>
      )}
    </Container>
  );
}
