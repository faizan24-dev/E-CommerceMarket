import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireAdmin } from "@/server/auth/guards";

export const metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

export default async function AdminLayout({ children }) {
  const user = await requireAdmin();
  return (
    <DashboardShell area="admin" title="Admin panel" subtitle={user.email}>
      {children}
    </DashboardShell>
  );
}
