import { CircleCheck, TriangleAlert, Wallet } from "lucide-react";
import RecordPayoutForm from "@/components/admin/RecordPayoutForm";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { PAYOUT_METHOD_TYPES } from "@/config/marketplace";
import { formatDate, formatMoney, pluralize } from "@/lib/format";
import { requireAdmin } from "@/server/auth/guards";
import { listPayouts, listSellerBalances } from "@/server/services/payoutService";
import { parsePagination } from "@/server/validators/parse";

export const metadata = { title: "Payouts" };

function PayoutDetails({ method }) {
  if (!method) {
    return (
      <p className="flex items-center gap-2 text-sm text-warning">
        <TriangleAlert className="size-4" aria-hidden="true" /> No payout method yet. Ask the seller to add one.
      </p>
    );
  }
  const config = PAYOUT_METHOD_TYPES[method.type];
  const rows = [
    ["Method", config?.label ?? method.type],
    [config?.providerLabel ?? "Provider", method.provider],
    ["Account holder", method.accountHolder],
    [config?.accountLabel ?? "Account", method.accountNumber ?? `ending ${method.accountLast4}`],
  ];
  return (
    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="break-all font-medium text-ink">{value}</dd>
        </div>
      ))}
      {method.notes && (
        <div className="sm:col-span-2">
          <dt className="text-xs text-muted">Seller notes</dt>
          <dd className="text-ink-soft">{method.notes}</dd>
        </div>
      )}
    </dl>
  );
}

/**
 * The payout workflow: see who is owed what and where to send it, transfer the
 * money from your bank, then record it here with the transfer reference.
 */
export default async function AdminPayoutsPage({ searchParams }) {
  await requireAdmin();
  const { page } = parsePagination(await searchParams);
  const [balances, history] = await Promise.all([listSellerBalances(), listPayouts({ page })]);
  const totalOwed = balances.reduce((sum, balance) => sum + balance.amount, 0);

  return (
    <>
      <PageHeader
        title="Payouts"
        description={
          balances.length
            ? `${pluralize(balances.length, "seller")} owed ${formatMoney(totalOwed)} in total.`
            : "Every seller is paid up."
        }
      />

      <div className="mt-8 space-y-4">
        {balances.length === 0 ? (
          <EmptyState icon={CircleCheck} title="Nothing to pay right now" description="Seller earnings appear here once their sales are paid." />
        ) : (
          balances.map((balance) => (
            <Card
              key={balance.sellerId}
              title={balance.storeName || balance.name}
              description={`${balance.name} | ${balance.email}`}
              actions={
                <div className="text-right">
                  <p className="font-serif text-3xl text-ink">{formatMoney(balance.amount)}</p>
                  <p className="text-xs text-muted">
                    {pluralize(balance.earningsCount, "sale")} since {formatDate(balance.oldestEarningAt)}
                  </p>
                  {balance.sellerStatus === "suspended" && <Badge tone="danger">Shop suspended</Badge>}
                </div>
              }
            >
              <div className="rounded-xl bg-canvas p-4">
                <PayoutDetails method={balance.payoutMethod} />
              </div>
              <div className="mt-5">
                <RecordPayoutForm sellerId={balance.sellerId} amount={balance.amount} disabled={!balance.payoutMethod} />
              </div>
            </Card>
          ))
        )}
      </div>

      <h2 className="mt-12 font-serif text-2xl text-ink">Payout history</h2>
      <div className="mt-4">
        <DataTable
          rows={history.payouts}
          getRowKey={(row) => row.id}
          caption="Payout history"
          columns={[
            { key: "date", header: "Date", render: (row) => formatDate(row.paidAt) },
            { key: "seller", header: "Seller", render: (row) => <span className="text-ink">{row.seller.storeName ?? row.seller.name}</span> },
            { key: "amount", header: "Amount", render: (row) => <span className="font-medium text-ink">{formatMoney(row.amount)}</span> },
            { key: "sales", header: "Sales", render: (row) => row.earningsCount },
            {
              key: "method",
              header: "Sent to",
              render: (row) => (row.method ? `${row.method.provider} ...${row.method.accountLast4}` : ""),
            },
            {
              key: "reference",
              header: "Reference",
              render: (row) => (
                <div>
                  <span className="font-mono text-xs">{row.reference}</span>
                  {row.note && <p className="text-xs text-muted">{row.note}</p>}
                </div>
              ),
            },
          ]}
          empty={<EmptyState icon={Wallet} title="No payouts recorded yet" className="py-8" />}
        />
        <Pagination page={page} pageCount={history.pageCount} hrefForPage={(n) => `/admin/payouts?page=${n}`} />
      </div>
    </>
  );
}
