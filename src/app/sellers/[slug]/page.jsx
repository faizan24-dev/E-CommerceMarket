import { cache } from "react";
import { notFound } from "next/navigation";
import { PackageOpen, Store } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { formatDate, pluralize } from "@/lib/format";
import { storeUrl } from "@/lib/routes";
import { preparePageData } from "@/server/page";
import { listPublishedProducts } from "@/server/services/productService";
import { getStorefront } from "@/server/services/sellerService";
import { parsePagination } from "@/server/validators/parse";

const getStore = cache(getStorefront);

export async function generateMetadata({ params }) {
  await preparePageData();
  const store = await getStore((await params).slug);
  return store ? { title: store.storeName, description: store.bio.slice(0, 160) || undefined } : { title: "Store not found" };
}

/** A seller's public storefront: profile and published products. */
export default async function StorefrontPage({ params, searchParams }) {
  await preparePageData();
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  const { page } = parsePagination(await searchParams);
  const { products, total, pageCount } = await listPublishedProducts({ sellerId: store.id, page, limit: 24 });

  return (
    <Container className="py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Sellers" }, { label: store.storeName }]} />

      <header className="mt-6 flex flex-col gap-6 rounded-3xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:p-10">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Store className="size-7" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">{store.storeName}</h1>
          <p className="mt-1 text-sm text-muted">
            {pluralize(total, "product")}
            {store.joinedAt && ` | Selling since ${formatDate(store.joinedAt)}`}
          </p>
          {store.bio && <p className="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">{store.bio}</p>}
        </div>
      </header>

      {products.length ? (
        <>
          <ProductGrid products={products} priorityCount={4} className="mt-10" />
          <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => `${storeUrl(slug)}?page=${n}`} />
        </>
      ) : (
        <EmptyState icon={PackageOpen} title="No products yet" description="This store hasn't published anything yet." />
      )}
    </Container>
  );
}
