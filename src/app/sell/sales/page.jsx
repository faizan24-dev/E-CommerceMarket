import { BadgeDollarSign } from "lucide-react";
import FilterTabs from "@/components/dashboard/FilterTabs";
import { StatusBadge } from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { COMMISSION_RATE } from "@/config/marketplace";
import { formatDate, formatMoney } from "@/lib/format";
import { requireSeller } from "@/server/auth/guards";
import { listSellerEarnings } from "@/server/services/sellerService";
import { parsePagination, readParam } from "@/server/validators/parse";

export const metadata = { title: "Sales" };

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid out" },
];

function salesUrl(status, page) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/sell/sales?${query}` : "/sell/sales";
}

/** Every sold item, with the price, the platform fee and what the seller earns. */
export default async function SalesPage({ searchParams }) {
  const user = await requireSeller("/sell/sales");
  const params = await searchParams;
  const status = STATUS_TABS.some((tab) => tab.value === readParam(params, "status")) ? readParam(params, "status") : "";
  const { page } = parsePagination(params);
  const { earnings, pageCount } = await listSellerEarnings(user._id, { status, page });

  return (
    <>
      <PageHeader
        title="Sales"
        description={`Each sale shows the price, the ${Math.round(COMMISSION_RATE * 100)}% platform fee and your earnings.`}
      />
      <div className="mt-6">
        <FilterTabs tabs={STATUS_TABS.map((tab) => ({ ...tab, href: salesUrl(tab.value) }))} active={status} label="Filter sales" />
      </div>
      <div className="mt-6">
        <DataTable
          rows={earnings}
          getRowKey={(row) => row.id}
          caption="Your sales"
          columns={[
            { key: "date", header: "Date", render: (row) => formatDate(row.earnedAt) },
            { key: "product", header: "Product", render: (row) => <span className="text-ink">{row.productTitle}</span> },
            { key: "order", header: "Order", render: (row) => <span className="font-mono text-xs">{row.orderNumber}</span> },
            { key: "gross", header: "Price", render: (row) => formatMoney(row.gross) },
            { key: "fee", header: "Fee", render: (row) => `-${formatMoney(row.commission)}` },
            { key: "net", header: "You earn", render: (row) => <span className="font-medium text-ink">{formatMoney(row.net)}</span> },
            { key: "status", header: "Payout", render: (row) => <StatusBadge type="earning" status={row.status} /> },
          ]}
          empty={<EmptyState icon={BadgeDollarSign} title="No sales here yet" description="Sales appear as soon as a buyer's payment is confirmed." />}
        />
        <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => salesUrl(status, n)} />
      </div>
    </>
  );
}
