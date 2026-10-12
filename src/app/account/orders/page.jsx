import Link from "next/link";
import { Receipt } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import { orderUrl } from "@/lib/routes";
import { requireUser } from "@/server/auth/guards";
import { listBuyerOrders } from "@/server/services/orderService";
import { parsePagination } from "@/server/validators/parse";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }) {
  const user = await requireUser("/account/orders");
  const { page } = parsePagination(await searchParams);
  const { orders, pageCount } = await listBuyerOrders(user._id, { page });

  const columns = [
    {
      key: "number",
      header: "Order",
      render: (order) => (
        <Link href={orderUrl(order.id)} className="font-medium text-ink hover:underline">
          {order.number}
        </Link>
      ),
    },
    { key: "date", header: "Date", render: (order) => formatDate(order.createdAt) },
    { key: "items", header: "Items", render: (order) => pluralize(order.items.length, "item") },
    { key: "total", header: "Total", render: (order) => formatPrice(order.total) },
    { key: "status", header: "Status", render: (order) => <StatusBadge type="order" status={order.status} /> },
    {
      key: "view",
      header: <span className="sr-only">Actions</span>,
      className: "text-right",
      render: (order) => (
        <Button href={orderUrl(order.id)} variant="secondary" size="sm">
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Orders" description="Your purchases and their payment status." />
      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={orders}
          getRowKey={(order) => order.id}
          caption="Your orders"
          empty={
            <EmptyState
              icon={Receipt}
              title="No orders yet"
              description="When you check out, your orders show up here."
              action={<Button href="/products">Start shopping</Button>}
            />
          }
        />
        <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => `/account/orders?page=${n}`} />
      </div>
    </>
  );
}
