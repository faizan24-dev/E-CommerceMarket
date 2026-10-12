import { ExternalLink } from "lucide-react";
import StoreForm from "@/components/seller/StoreForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { storeUrl } from "@/lib/routes";
import { requireSeller } from "@/server/auth/guards";

export const metadata = { title: "Store settings" };

export default async function StoreSettingsPage() {
  const user = await requireSeller("/sell/settings");

  return (
    <>
      <PageHeader
        title="Store settings"
        description="How your store appears to buyers."
        actions={
          user.seller && (
            <Button href={storeUrl(user.seller.storeSlug)} variant="secondary" iconRight={ExternalLink}>
              View your store
            </Button>
          )
        }
      />
      <Card className="mt-8 max-w-2xl">
        {user.seller ? (
          <StoreForm mode="edit" initial={{ storeName: user.seller.storeName, bio: user.seller.bio ?? "" }} />
        ) : (
          <p className="text-sm text-muted">Admin accounts sell as the platform and don&apos;t need a store profile.</p>
        )}
      </Card>
    </>
  );
}
