import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote } from "lucide-react";
import CancelOrderButton from "@/components/account/CancelOrderButton";
import PaymentReferenceForm from "@/components/account/PaymentReferenceForm";
import OrderAdminActions from "@/components/admin/OrderAdminActions";
import DownloadLink from "@/components/dashboard/DownloadLink";
import Alert from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { formatDateTime, formatPrice } from "@/lib/format";
import { productUrl } from "@/lib/routes";
import { requireUser } from "@/server/auth/guards";
import { isAdmin } from "@/server/auth/policies";
import { getEnv } from "@/server/config/env";
import { AppError } from "@/server/errors";
import { getOrderForViewer } from "@/server/services/orderService";

export const metadata = { title: "Order details" };

const UNPAID = ["pending_payment", "awaiting_confirmation"];

export default async function OrderPage({ params }) {
  const { orderId } = await params;
  const user = await requireUser(`/account/orders/${orderId}`);

  let order;
  try {
    order = await getOrderForViewer(user, orderId);
  } catch (error) {
    if (error instanceof AppError && error.statusCode < 500) notFound();
    throw error;
  }

  const isBuyer = order.buyer.id === String(user._id);
  const isPaid = order.status === "paid";
  const isUnpaid = UNPAID.includes(order.status);

  return (
    <>
      <PageHeader
        title={`Order ${order.number}`}
        description={`Placed ${formatDateTime(order.createdAt)}${isBuyer ? "" : ` by ${order.buyer.name} (${order.buyer.email})`}`}
        actions={
          <Button href={isBuyer ? "/account/orders" : "/admin/orders"} variant="secondary" icon={ArrowLeft}>
            All orders
          </Button>
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card title="Items" actions={<StatusBadge type="order" status={order.status} />}>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.productId} className="flex flex-wrap items-center gap-4 py-4 first:pt-0 last:pb-0">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {item.coverUrl && <Image src={item.coverUrl} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={productUrl(item.slug)} className="font-medium text-ink hover:underline">
                    {item.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{item.fileType}</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                {isPaid && isBuyer && <DownloadLink productId={item.productId} />}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-line pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </Card>

        <div className="space-y-6">
          {isPaid && (
            <Alert tone="success" title="Payment confirmed">
              Paid {formatDateTime(order.paidAt)}. {isBuyer && "Your files are also in your library."}
            </Alert>
          )}
          {order.status === "cancelled" && (
            <Alert tone="warning" title="Order cancelled">
              {order.cancelReason ?? "This order was cancelled."}
            </Alert>
          )}
          {order.status === "awaiting_confirmation" && (
            <Alert tone="info" title="Payment submitted">
              Reference <span className="font-mono">{order.payment.reference}</span>. We&apos;ll unlock your downloads as soon
              as the transfer is confirmed.
            </Alert>
          )}

          {isUnpaid && isBuyer && (
            <Card title="How to pay">
              <div className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <Banknote className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="whitespace-pre-line">{getEnv().PAYMENT_INSTRUCTIONS}</p>
              </div>
              <p className="mt-4 rounded-xl bg-canvas px-4 py-3 text-sm">
                Amount: <span className="font-semibold">{formatPrice(order.total)}</span> | Use{" "}
                <span className="font-mono font-semibold">{order.number}</span> as the payment note.
              </p>
              <div className="mt-6 border-t border-line pt-6">
                <PaymentReferenceForm orderId={order.id} initialReference={order.payment.reference ?? ""} />
              </div>
              <div className="mt-6 border-t border-line pt-6">
                <CancelOrderButton orderId={order.id} />
              </div>
            </Card>
          )}

          {isUnpaid && isAdmin(user) && (
            <Card title="Admin" description="Confirm once the transfer has arrived in your account.">
              {order.payment.reference && (
                <p className="mb-4 text-sm">
                  Buyer reference: <span className="font-mono font-semibold">{order.payment.reference}</span>
                </p>
              )}
              <OrderAdminActions orderId={order.id} />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
