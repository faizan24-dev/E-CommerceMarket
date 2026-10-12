import Image from "next/image";
import Link from "next/link";
import { Library } from "lucide-react";
import DownloadLink from "@/components/dashboard/DownloadLink";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { formatDate, pluralize } from "@/lib/format";
import { orderUrl, productUrl } from "@/lib/routes";
import { requireUser } from "@/server/auth/guards";
import { getLibrary } from "@/server/services/orderService";

export const metadata = { title: "My library" };

/** Every product the user has paid for, ready to download again at any time. */
export default async function LibraryPage() {
  const user = await requireUser("/account");
  const items = await getLibrary(user._id);

  return (
    <>
      <PageHeader
        title="My library"
        description={items.length ? `${pluralize(items.length, "product")} ready to download.` : undefined}
      />
      {items.length === 0 ? (
        <EmptyState
          icon={Library}
          title="Your library is empty"
          description="Products you buy appear here, ready to download whenever you need them."
          action={<Button href="/products">Browse products</Button>}
        />
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.productId} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
              <Link href={productUrl(item.slug)} className="relative block aspect-[16/10] bg-cream">
                {item.coverUrl && (
                  <Image src={item.coverUrl} alt="" fill sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-medium leading-snug text-ink">{item.title}</h2>
                <p className="mt-1 text-xs text-muted">
                  {item.fileType} | Bought {formatDate(item.purchasedAt)} |{" "}
                  <Link href={orderUrl(item.orderId)} className="hover:text-ink hover:underline">
                    {item.orderNumber}
                  </Link>
                </p>
                <div className="mt-auto pt-4">
                  <DownloadLink productId={item.productId} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
