import Link from "next/link";
import { BadgeDollarSign, CircleCheck, Clock, Package, Percent, Plus, Upload, Wallet } from "lucide-react";
import StoreForm from "@/components/seller/StoreForm";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { COMMISSION_RATE } from "@/config/marketplace";
import { formatDate, formatMoney, pluralize } from "@/lib/format";
import { requireUser } from "@/server/auth/guards";
import { canSell, isAdmin } from "@/server/auth/policies";
import { getSellerOverview } from "@/server/services/sellerService";

export const metadata = { title: "Sell on Ecommerce Market" };

const commissionPercent = Math.round(COMMISSION_RATE * 100);

function Onboarding() {
  const steps = [
    { icon: Upload, title: "Upload your files", text: "Add a cover image and your PDF. We review it and publish it in the shop." },
    { icon: BadgeDollarSign, title: "Buyers pay, you earn", text: `You keep ${100 - commissionPercent}% of every sale. The platform fee is ${commissionPercent}%.` },
    { icon: Wallet, title: "Get paid", text: "Add your bank or wallet details. Payouts are sent manually and tracked in your dashboard." },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Become a seller</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl">Turn your work into a shop.</h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Sell e-books, guides, templates and other digital files to buyers who value quality.
        </p>
        <ul className="mt-8 space-y-6">
          {steps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-ink">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Card title="Open your shop" description="It takes a minute. You can change these details later.">
        <StoreForm mode="create" />
      </Card>
    </div>
  );
}

export default async function SellPage() {
  const user = await requireUser("/sell");
  if (!canSell(user)) return <Onboarding />;

  const overview = await getSellerOverview(user._id);
  const { totals, balances, products } = overview;
  const pendingCount = products.pending ?? 0;
  const rejectedCount = products.rejected ?? 0;

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Your sales and earnings. The platform keeps ${commissionPercent}% of each sale; the rest is yours.`}
        actions={
          <Button href="/sell/products/new" icon={Plus}>
            New product
          </Button>
        }
      />

      <div className="mt-6 space-y-3">
        {isAdmin(user) && (
          <Alert tone="info">
            Products you upload as an admin are platform products: they publish immediately and all revenue shows in the{" "}
            <Link href="/admin" className="font-medium underline">
              admin overview
            </Link>
            .
          </Alert>
        )}
        {!isAdmin(user) && !user.seller?.payoutMethod && (
          <Alert tone="warning" title="Add a payout method">
            We need your bank or wallet details to send your earnings.{" "}
            <Link href="/sell/payouts" className="font-medium underline">
              Add payout details
            </Link>
          </Alert>
        )}
        {rejectedCount > 0 && (
          <Alert tone="error">
            {pluralize(rejectedCount, "product")} needs changes before it can be published.{" "}
            <Link href="/sell/products" className="font-medium underline">
              Review feedback
            </Link>
          </Alert>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Your earnings" value={formatMoney(totals.net)} hint={`From ${pluralize(totals.sales, "sale")}`} icon={BadgeDollarSign} />
        <StatCard label="Unpaid balance" value={formatMoney(balances.unpaid)} hint="Sent with your next payout" icon={Clock} tone="warning" />
        <StatCard label="Paid out" value={formatMoney(balances.paid)} icon={CircleCheck} tone="success" />
        <StatCard
          label="Platform fees"
          value={formatMoney(totals.commission)}
          hint={`${commissionPercent}% of ${formatMoney(totals.gross)} in sales`}
          icon={Percent}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card
          title="Products"
          actions={
            <Button href="/sell/products" variant="secondary" size="sm">
              Manage
            </Button>
          }
        >
          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            {[
              ["Published", products.published ?? 0],
              ["In review", pendingCount],
              ["Need changes", rejectedCount],
              ["Archived", products.archived ?? 0],
            ].map(([label, count]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="mt-1 font-serif text-2xl text-ink">{count}</dd>
              </div>
            ))}
          </dl>
          {overview.topProducts.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted">Best sellers</h3>
              <ul className="mt-2 divide-y divide-line text-sm">
                {overview.topProducts.map((product) => (
                  <li key={product.productId} className="flex justify-between gap-4 py-2.5">
                    <span className="truncate text-ink">{product.title}</span>
                    <span className="shrink-0 text-muted">
                      {pluralize(product.sales, "sale")} | {formatMoney(product.net)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card
          title="Recent sales"
          actions={
            <Button href="/sell/sales" variant="secondary" size="sm">
              All sales
            </Button>
          }
        >
          <DataTable
            rows={overview.recentEarnings}
            getRowKey={(row) => row.id}
            columns={[
              { key: "product", header: "Product", render: (row) => <span className="text-ink">{row.productTitle}</span> },
              { key: "date", header: "Date", render: (row) => formatDate(row.earnedAt) },
              { key: "net", header: "You earn", className: "text-right", render: (row) => formatMoney(row.net) },
            ]}
            empty={
              <p className="flex items-center gap-2 text-sm text-muted">
                <Package className="size-4" aria-hidden="true" /> No sales yet. They will show up here.
              </p>
            }
          />
        </Card>
      </div>
    </>
  );
}
