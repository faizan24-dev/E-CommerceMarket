import { Clock, Wallet } from "lucide-react";
import PayoutMethodForm from "@/components/seller/PayoutMethodForm";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { PAYOUT_METHOD_TYPES } from "@/config/marketplace";
import { formatDate, formatMoney, pluralize } from "@/lib/format";
import { requireSeller } from "@/server/auth/guards";
import { getPayoutMethod, getSellerOverview, listSellerPayouts } from "@/server/services/sellerService";

export const metadata = { title: "Payouts" };

export default async function PayoutsPage() {
  const user = await requireSeller("/sell/payouts");
  const [method, payouts, overview] = await Promise.all([
    getPayoutMethod(user._id),
    listSellerPayouts(user._id),
    getSellerOverview(user._id),
  ]);

  return (
    <>
      <PageHeader
        title="Payouts"
        description="We send your earnings manually to the account below and record every transfer here."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Unpaid balance" value={formatMoney(overview.balances.unpaid)} hint="Included in your next payout" icon={Clock} tone="warning" />
        <StatCard
          label="Paid out so far"
          value={formatMoney(overview.balances.paid)}
          hint={pluralize(payouts.length, "payout")}
          icon={Wallet}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card title="Payout method" description="Where your earnings are sent.">
          {user.seller ? (
            <PayoutMethodForm current={method} />
          ) : (
            <p className="text-sm text-muted">Admin accounts sell as the platform and don&apos;t receive payouts.</p>
          )}
        </Card>

        <Card title="Payout history">
          <DataTable
            rows={payouts}
            getRowKey={(row) => row.id}
            caption="Payout history"
            columns={[
              { key: "date", header: "Date", render: (row) => formatDate(row.paidAt) },
              { key: "amount", header: "Amount", render: (row) => <span className="font-medium text-ink">{formatMoney(row.amount)}</span> },
              {
                key: "to",
                header: "Sent to",
                render: (row) =>
                  row.method ? `${PAYOUT_METHOD_TYPES[row.method.type]?.label ?? row.method.type} ...${row.method.accountLast4}` : "",
              },
              { key: "reference", header: "Reference", render: (row) => <span className="font-mono text-xs">{row.reference}</span> },
            ]}
            empty={<EmptyState icon={Wallet} title="No payouts yet" description="Your first payout will appear here once it's sent." className="py-8" />}
          />
        </Card>
      </div>
    </>
  );
}
