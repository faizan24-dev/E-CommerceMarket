import ProductForm from "@/components/seller/ProductForm";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { requireSeller } from "@/server/auth/guards";
import { isAdmin } from "@/server/auth/policies";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const user = await requireSeller("/sell/products/new");
  const admin = isAdmin(user);

  return (
    <>
      <PageHeader
        title="New product"
        description={
          admin
            ? "Platform products are published immediately."
            : "Fill in the details and upload your files. We'll review it, usually within a day."
        }
      />
      <Card className="mt-8">
        <ProductForm isAdmin={admin} />
      </Card>
    </>
  );
}
