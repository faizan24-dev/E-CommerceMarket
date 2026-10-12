import { notFound } from "next/navigation";
import ProductForm from "@/components/seller/ProductForm";
import Alert from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { requireSeller } from "@/server/auth/guards";
import { isAdmin, ownsProduct } from "@/server/auth/policies";
import { AppError } from "@/server/errors";
import { getManagedProduct } from "@/server/services/productService";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }) {
  const { productId } = await params;
  const user = await requireSeller(`/sell/products/${productId}/edit`);

  let product;
  try {
    product = await getManagedProduct(user, productId);
  } catch (error) {
    if (error instanceof AppError && error.statusCode < 500) notFound();
    throw error;
  }

  // Admins editing another seller's product return to the moderation list.
  const isOwner = ownsProduct(user, { seller: product.seller.id });
  const redirectTo = isAdmin(user) && !isOwner ? "/admin/products" : "/sell/products";

  return (
    <>
      <PageHeader title="Edit product" description={product.title} actions={<StatusBadge type="product" status={product.status} />} />
      {product.status === "rejected" && product.reviewNote && (
        <Alert tone="error" title="Changes requested" className="mt-6">
          {product.reviewNote}
        </Alert>
      )}
      <Card className="mt-8">
        <ProductForm product={product} isAdmin={isAdmin(user)} redirectTo={redirectTo} />
      </Card>
    </>
  );
}
