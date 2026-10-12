import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/server/auth/guards";

export default async function AccountLayout({ children }) {
  const user = await requireUser("/account");
  return (
    <DashboardShell area="account" title="My account" subtitle={user.email}>
      {children}
    </DashboardShell>
  );
}
