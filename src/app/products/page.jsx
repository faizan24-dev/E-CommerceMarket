import Link from "next/link";
import { SearchX, X } from "lucide-react";
import { categories } from "@/data/mockData";
import { filterProducts, formatPrice, getBundle, getCategoryBySlug } from "@/lib/catalog";
import AddBundleButton from "@/components/AddBundleButton";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop all products",
  description: "Browse templates, software, e-books and vector packs, all available for instant download.",
};

function buildHref({ q, category }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const activeCategory = getCategoryBySlug(typeof params.category === "string" ? params.category : "");
  const categorySlug = activeCategory?.slug ?? "";
  // ?bundle=<slug> shows the products in a bundle (linked from the home page Collections cards).
  const bundle = typeof params.bundle === "string" ? getBundle(params.bundle) : null;
  const results = bundle ? bundle.items : filterProducts({ query: q, category: categorySlug });

  const heading = bundle ? bundle.title : q ?`Results for “${q}”` : activeCategory ? activeCategory.name : "All digital products";
  const pills = [{ slug: "", name: "All" }, ...categories];

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{bundle ? "Bundle" : activeCategory ? activeCategory.name : "Shop"}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">{heading}</h1>
          <p className="mt-2 text-sm text-muted">
            {bundle ? `${bundle.subtitle} ` : ""}
            {results.length} {results.length === 1 ? "product" : "products"}
            {q && activeCategory ? ` in ${activeCategory.name}` : ""} · Instant download on every item
          </p>
        </div>
      </div>

      {bundle && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-sm text-muted">
            Buy all {bundle.items.length} together:{" "}
            <span className="mr-1 line-through">{formatPrice(bundle.total)}</span>{" "}
            <span className="text-lg font-semibold text-ink">{formatPrice(bundle.bundlePrice)}</span>
            <span className="ml-2 text-xs text-success">10% bundle savings applied in your cart</span>
          </p>
          <AddBundleButton productIds={bundle.productIds} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-line pb-6">
        {pills.map((pill) => {
          const isActive = !bundle && pill.slug === categorySlug;
          return (
            <Link
              key={pill.slug || "all"}
              href={buildHref({ q, category: pill.slug })}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-soft hover:border-ink/40"
              }`}
            >
              {pill.name}
            </Link>
          );
        })}
        {q && (
          <Link
            href={buildHref({ category: categorySlug })}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-2 text-sm text-ink transition hover:bg-sand"
          >
            “{q}” <X className="size-3.5" aria-label="Clear search" />
          </Link>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {results.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-16 flex max-w-md flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream">
            <SearchX className="size-6 text-muted" strokeWidth={1.5} />
          </span>
          <h2 className="mt-5 font-serif text-2xl">No products found</h2>
          <p className="mt-2 text-sm text-muted">
            We couldn&apos;t find anything matching “{q}”
            {activeCategory ? ` in ${activeCategory.name}` : ""}. Try a broader term or another category.
          </p>
          <Link
            href="/products"
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-soft"
          >
            View all products
          </Link>
        </div>
      )}
    </div>
  );
}
