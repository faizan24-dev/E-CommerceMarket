import Link from "next/link";
import { BadgeDollarSign, Banknote, Clock, Package, Percent, Receipt, ShoppingBag, Store, Users, Wallet } from "lucide-react";
import Alert from "@/components/ui/Alert";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { formatDate, formatMoney, formatPrice, pluralize } from "@/lib/format";
import { orderUrl } from "@/lib/routes";
import { requireAdmin } from "@/server/auth/guards";
import { getAdminOverview } from "@/server/services/statsService";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const stats = await getAdminOverview();
  const { sales } = stats;

  const todo = [
    stats.paymentsToConfirm > 0 && {
      href: "/admin/orders?status=awaiting_confirmation",
      text: `${pluralize(stats.paymentsToConfirm, "order")} waiting for payment confirmation`,
    },
    stats.pendingProducts > 0 && { href: "/admin/products?status=pending", text: `${pluralize(stats.pendingProducts, "product")} to review` },
    stats.sellersAwaitingPayout > 0 && {
      href: "/admin/payouts",
      text: `${pluralize(stats.sellersAwaitingPayout, "seller")} owed ${formatMoney(stats.owedToSellers)}`,
    },
  ].filter(Boolean);

  return (
    <>
      <PageHeader title="Overview" description="Sales, commission and everything waiting for you." />

      {todo.length > 0 && (
        <Alert tone="warning" title="Needs your attention" className="mt-6">
          <ul className="mt-1 space-y-1">
            {todo.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline underline-offset-2">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">Money (paid orders)</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Gross sales" value={formatMoney(sales.gmv)} hint={`${pluralize(sales.itemsSold, "item")} in ${pluralize(sales.orders, "order")}`} icon={ShoppingBag} />
        <StatCard label="Platform revenue" value={formatMoney(sales.platformRevenue)} hint="Commission plus platform products" icon={Percent} tone="success" />
        <StatCard label="Seller earnings" value={formatMoney(sales.sellerEarnings)} hint="Total credited to sellers" icon={BadgeDollarSign} />
        <StatCard label="Owed to sellers" value={formatMoney(stats.owedToSellers)} hint="Unpaid balances" icon={Clock} tone="warning" />
        <StatCard label="Paid out" value={formatMoney(stats.paidOut)} hint={pluralize(stats.payoutCount, "payout")} icon={Wallet} />
        <StatCard label="Payments to confirm" value={stats.paymentsToConfirm} hint="Manual transfers" icon={Banknote} />
      </div>

      <h2 className="mt-8 text-xs font-medium uppercase tracking-wide text-muted">Marketplace</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={stats.userCount} icon={Users} />
        <StatCard label="Sellers" value={stats.sellerCount} icon={Store} />
        <StatCard label="Products in review" value={stats.pendingProducts} icon={Package} />
      </div>

      <Card
        title="Recent orders"
        className="mt-8"
        actions={
          <Button href="/admin/orders" variant="secondary" size="sm" icon={Receipt}>
            All orders
          </Button>
        }
      >
        <DataTable
          rows={stats.recentOrders}
          getRowKey={(order) => order.id}
          caption="Recent orders"
          columns={[
            {
              key: "number",
              header: "Order",
              render: (order) => (
                <Link href={orderUrl(order.id)} className="font-medium text-ink hover:underline">
                  {order.number}
                </Link>
              ),
            },
            { key: "buyer", header: "Buyer", render: (order) => order.buyer.email },
            { key: "date", header: "Date", render: (order) => formatDate(order.createdAt) },
            { key: "total", header: "Total", render: (order) => formatPrice(order.total) },
            { key: "status", header: "Status", render: (order) => <StatusBadge type="order" status={order.status} /> },
          ]}
          empty={<p className="text-sm text-muted">No orders yet.</p>}
        />
      </Card>
    </>
  );
}
