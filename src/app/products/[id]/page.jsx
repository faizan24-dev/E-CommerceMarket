import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Check, Download, FileText, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { products } from "@/data/mockData";
import { formatPrice, getCategoryByName, getProductById } from "@/lib/catalog";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return { title: product.title, description: product.description };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const category = getCategoryByName(product.category);
  const related = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  const details = [
    { icon: FileText, label: "Format", value: product.fileType },
    { icon: Download, label: "Delivery", value: "Instant download" },
    { icon: InfinityIcon, label: "Access", value: "Lifetime, with updates" },
    { icon: ShieldCheck, label: "Checkout", value: "Secure & encrypted" },
  ];

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${category?.slug ?? ""}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow-sm">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted">
            by <span className="font-medium text-ink">{product.seller}</span>
            <BadgeCheck className="size-4 text-accent" aria-label="Verified seller" />
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {product.title}
          </h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-3 text-sm" />
          <p className="mt-6 text-3xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton productId={product.id} productTitle={product.title} size="lg" />
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">What&apos;s included</h2>
            <ul className="mt-3 space-y-2">
              {product.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-ink-soft">
                  <Check className="size-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={1.75} />
                <div>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="text-sm font-medium text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-20 border-t border-line pt-12">
        <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">You might also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
