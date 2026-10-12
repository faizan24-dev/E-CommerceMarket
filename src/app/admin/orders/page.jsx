import Link from "next/link";
import { Receipt } from "lucide-react";
import OrderAdminActions from "@/components/admin/OrderAdminActions";
import FilterTabs from "@/components/dashboard/FilterTabs";
import { StatusBadge } from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { ORDER_STATUS } from "@/config/marketplace";
import { formatDateTime, formatMoney, formatPrice } from "@/lib/format";
import { orderUrl } from "@/lib/routes";
import { requireAdmin } from "@/server/auth/guards";
import { listOrdersForAdmin } from "@/server/services/orderService";
import { parsePagination, readParam } from "@/server/validators/parse";

export const metadata = { title: "Orders" };

const TABS = [{ value: "", label: "All" }, ...Object.entries(ORDER_STATUS).map(([value, { label }]) => ({ value, label }))];
const UNPAID = ["pending_payment", "awaiting_confirmation"];

function pageUrl(status, page) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

export default async function AdminOrdersPage({ searchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const status = ORDER_STATUS[readParam(params, "status")] ? readParam(params, "status") : "";
  const { page } = parsePagination(params);
  const { orders, pageCount } = await listOrdersForAdmin({ status, page });

  return (
    <>
      <PageHeader
        title="Orders"
        description="Match bank transfers by the buyer's reference, then confirm to unlock their downloads and credit sellers."
      />
      <div className="mt-6">
        <FilterTabs tabs={TABS.map((tab) => ({ ...tab, href: pageUrl(tab.value) }))} active={status} label="Filter by status" />
      </div>
      <div className="mt-6">
        <DataTable
          rows={orders}
          getRowKey={(order) => order.id}
          caption="Orders"
          columns={[
            {
              key: "number",
              header: "Order",
              render: (order) => (
                <div>
                  <Link href={orderUrl(order.id)} className="font-medium text-ink hover:underline">
                    {order.number}
                  </Link>
                  <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                </div>
              ),
            },
            {
              key: "buyer",
              header: "Buyer",
              render: (order) => (
                <div>
                  <p className="text-ink">{order.buyer.name}</p>
                  <p className="text-xs text-muted">{order.buyer.email}</p>
                </div>
              ),
            },
            {
              key: "items",
              header: "Items",
              render: (order) => <p className="max-w-56 text-xs">{order.items.map((item) => item.title).join(", ")}</p>,
            },
            {
              key: "total",
              header: "Total",
              render: (order) => (
                <div>
                  <p className="font-medium text-ink">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted">Fee {formatMoney(order.items.reduce((sum, item) => sum + item.commission, 0))}</p>
                </div>
              ),
            },
            {
              key: "payment",
              header: "Payment",
              render: (order) => (
                <div>
                  <StatusBadge type="order" status={order.status} />
                  {order.payment.reference && <p className="mt-1 font-mono text-xs">{order.payment.reference}</p>}
                </div>
              ),
            },
            {
              key: "actions",
              header: <span className="sr-only">Actions</span>,
              className: "text-right",
              render: (order) => (UNPAID.includes(order.status) ? <OrderAdminActions orderId={order.id} compact /> : null),
            },
          ]}
          empty={<EmptyState icon={Receipt} title="No orders" description="No orders match this filter." />}
        />
        <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => pageUrl(status, n)} />
      </div>
    </>
  );
}
