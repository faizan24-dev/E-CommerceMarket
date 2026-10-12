import DashboardShell from "@/components/dashboard/DashboardShell";
import Container from "@/components/ui/Container";
import { requireUser } from "@/server/auth/guards";
import { canSell } from "@/server/auth/policies";

/** Sellers get the dashboard sidebar; everyone else sees the onboarding page full width. */
export default async function SellLayout({ children }) {
  const user = await requireUser("/sell");
  if (!canSell(user)) return <Container className="py-10 lg:py-14">{children}</Container>;

  return (
    <DashboardShell area="sell" title="Seller dashboard" subtitle={user.seller?.storeName ?? user.name}>
      {children}
    </DashboardShell>
  );
}
