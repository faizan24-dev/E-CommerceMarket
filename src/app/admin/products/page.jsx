import Image from "next/image";
import Link from "next/link";
import { Package, Pencil, Plus, Star } from "lucide-react";
import ProductModerationActions from "@/components/admin/ProductModerationActions";
import FilterTabs from "@/components/dashboard/FilterTabs";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { getCategory } from "@/config/categories";
import { PRODUCT_STATUS } from "@/config/marketplace";
import { formatDate, formatPrice } from "@/lib/format";
import { productUrl, storeUrl } from "@/lib/routes";
import { requireAdmin } from "@/server/auth/guards";
import { listProductsForAdmin } from "@/server/services/productService";
import { parsePagination, readParam } from "@/server/validators/parse";

export const metadata = { title: "Products" };

const TABS = [{ value: "", label: "All" }, ...Object.entries(PRODUCT_STATUS).map(([value, { label }]) => ({ value, label }))];

function pageUrl({ status, q, page }) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/products?${query}` : "/admin/products";
}

export default async function AdminProductsPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = PRODUCT_STATUS[readParam(params, "status")] ? readParam(params, "status") : "";
  const q = readParam(params, "q").trim().slice(0, 80);
  const { page } = parsePagination(params);
  const { products, total, pageCount } = await listProductsForAdmin({ status, q, page });

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-cream">
            {product.coverUrl && <Image src={product.coverUrl} alt="" fill sizes="48px" className="object-cover" />}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-medium text-ink">
              {product.isFeatured && <Star className="size-3.5 fill-accent text-accent" aria-label="Featured" />}
              {product.status === "published" ? (
                <Link href={productUrl(product.slug)} className="hover:underline">
                  {product.title}
                </Link>
              ) : (
                product.title
              )}
            </p>
            <p className="text-xs text-muted">
              {getCategory(product.category)?.name} | {product.file ? `${product.file.filename}` : "No file"}
            </p>
            {product.reviewNote && <p className="mt-1 max-w-xs text-xs text-muted">Note: {product.reviewNote}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Seller",
      render: (product) =>
        product.seller.storeSlug ? (
          <Link href={storeUrl(product.seller.storeSlug)} className="hover:underline">
            {product.seller.storeName}
          </Link>
        ) : (
          (product.seller.storeName ?? "Platform")
        ),
    },
    { key: "price", header: "Price", render: (product) => formatPrice(product.price) },
    { key: "status", header: "Status", render: (product) => <StatusBadge type="product" status={product.status} /> },
    { key: "created", header: "Submitted", render: (product) => formatDate(product.createdAt) },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (product) => (
        <div className="flex flex-col items-end gap-1.5">
          <ProductModerationActions product={product} />
          <Link href={`/sell/products/${product.id}/edit`} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
            <Pencil className="size-3" aria-hidden="true" /> Edit details
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description={`${total} ${total === 1 ? "product" : "products"}. Review seller uploads before they reach the shop.`}
        actions={
          <Button href="/sell/products/new" icon={Plus}>
            Add product
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs tabs={TABS.map((tab) => ({ ...tab, href: pageUrl({ status: tab.value, q }) }))} active={status} label="Filter by status" />
        <form action="/admin/products" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="admin-product-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-product-search"
            name="q"
            defaultValue={q}
            placeholder="Search title or store"
            maxLength={80}
            className="h-10 w-56 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink/60"
          />
          <Button type="submit" variant="secondary" size="sm" className="h-10">
            Search
          </Button>
        </form>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={products}
          getRowKey={(product) => product.id}
          caption="Products"
          empty={<EmptyState icon={Package} title="Nothing here" description="No products match this filter." />}
        />
        <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => pageUrl({ status, q, page: n })} />
      </div>
    </>
  );
}
