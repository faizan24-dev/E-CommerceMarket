import Link from "next/link";
import { SearchX, X } from "lucide-react";
import { CATEGORIES, getCategory } from "@/config/categories";
import { ProductGrid } from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { pluralize } from "@/lib/format";
import { productsUrl } from "@/lib/routes";
import { preparePageData } from "@/server/page";
import { listPublishedProducts, PRODUCT_SORT_OPTIONS } from "@/server/services/productService";
import { parsePagination, readParam } from "@/server/validators/parse";

export const metadata = {
  title: "Shop all products",
  description: "Browse templates, e-books, software and vector packs from independent creators.",
};

const SORT_LABELS = { newest: "Newest", popular: "Popular", price_asc: "Price: low to high", price_desc: "Price: high to low" };

export default async function ProductsPage({ searchParams }) {
  await preparePageData();
  const params = await searchParams;

  const q = readParam(params, "q").trim().slice(0, 80);
  const category = getCategory(readParam(params, "category"));
  const featured = readParam(params, "featured") === "1";
  const sortParam = readParam(params, "sort");
  const sort = PRODUCT_SORT_OPTIONS.includes(sortParam) ? sortParam : "newest";
  const { page } = parsePagination(params);

  const { products, total, pageCount } = await listPublishedProducts({
    q,
    category: category?.slug,
    featured,
    sort,
    page,
    limit: 24,
  });

  const filters = { q, category: category?.slug, featured, sort };
  const heading = q ? `Results for "${q}"` : featured ? "Staff picks" : (category?.name ?? "All digital products");
  const pills = [{ slug: "", name: "All" }, ...CATEGORIES];

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumbs items={[{ label: category?.name ?? (featured ? "Staff picks" : "Shop") }]} />

      <div className="mt-4">
        <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">{heading}</h1>
        <p className="mt-2 text-sm text-muted">
          {pluralize(total, "product")}
          {q && category ? ` in ${category.name}` : ""} | Digital delivery on every item
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {pills.map((pill) => {
            const isActive = !featured && pill.slug === (category?.slug ?? "");
            return (
              <Link
                key={pill.slug || "all"}
                href={productsUrl({ ...filters, featured: false, category: pill.slug })}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isActive ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink/40"
                }`}
              >
                {pill.name}
              </Link>
            );
          })}
          {q && (
            <Link
              href={productsUrl({ ...filters, q: "" })}
              className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-2 text-sm text-ink transition hover:bg-sand"
            >
              &ldquo;{q}&rdquo; <X className="size-3.5" aria-label="Clear search" />
            </Link>
          )}
        </div>

        <nav aria-label="Sort products" className="flex flex-wrap items-center gap-1.5 text-sm">
          <span className="mr-1 text-muted">Sort:</span>
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <Link
              key={value}
              href={productsUrl({ ...filters, sort: value })}
              aria-current={sort === value ? "true" : undefined}
              className={`rounded-full px-3 py-1.5 transition ${sort === value ? "bg-cream font-medium text-ink" : "text-ink-soft hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} priorityCount={4} className="mt-10" />
          <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => productsUrl({ ...filters, page: n })} />
        </>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No products found"
          description={
            q
              ? `We couldn't find anything matching "${q}"${category ? ` in ${category.name}` : ""}. Try a broader term or another category.`
              : "Nothing here yet. Check back soon, new products are added every week."
          }
          action={<Button href="/products">View all products</Button>}
          className="mt-6"
        />
      )}
    </Container>
  );
}
