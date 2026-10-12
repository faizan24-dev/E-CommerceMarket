import Image from "next/image";
import Link from "next/link";
import { Eye, Package, Pencil, Plus } from "lucide-react";
import ArchiveProductButton from "@/components/seller/ArchiveProductButton";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate, formatPrice } from "@/lib/format";
import { productUrl } from "@/lib/routes";
import { requireSeller } from "@/server/auth/guards";
import { listSellerProducts } from "@/server/services/productService";

export const metadata = { title: "Your products" };

export default async function SellerProductsPage() {
  const user = await requireSeller("/sell/products");
  const products = await listSellerProducts(user._id);

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
            <p className="font-medium text-ink">{product.title}</p>
            <p className="text-xs text-muted">{product.fileType}</p>
            {product.status === "rejected" && product.reviewNote && (
              <p className="mt-1 max-w-sm text-xs text-danger">Feedback: {product.reviewNote}</p>
            )}
          </div>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (product) => <StatusBadge type="product" status={product.status} /> },
    { key: "price", header: "Price", render: (product) => formatPrice(product.price) },
    { key: "sales", header: "Sales", render: (product) => product.salesCount },
    { key: "updated", header: "Updated", render: (product) => formatDate(product.updatedAt) },
    {
      key: "actions",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (product) => (
        <div className="flex flex-wrap justify-end gap-1">
          {product.status === "published" && (
            <Link href={productUrl(product.slug)} className="rounded-full p-2 text-muted hover:bg-cream hover:text-ink" title="View in shop">
              <Eye className="size-4" aria-hidden="true" />
              <span className="sr-only">View {product.title} in shop</span>
            </Link>
          )}
          <Button href={`/sell/products/${product.id}/edit`} variant="secondary" size="sm" icon={Pencil}>
            Edit
          </Button>
          {product.status !== "archived" && <ArchiveProductButton productId={product.id} title={product.title} />}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything you've uploaded. New products and edits are reviewed before they go live."
        actions={
          <Button href="/sell/products/new" icon={Plus}>
            New product
          </Button>
        }
      />
      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={products}
          getRowKey={(product) => product.id}
          caption="Your products"
          empty={
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Upload your first PDF with a cover image to start selling."
              action={
                <Button href="/sell/products/new" icon={Plus}>
                  Upload a product
                </Button>
              }
            />
          }
        />
      </div>
    </>
  );
}
