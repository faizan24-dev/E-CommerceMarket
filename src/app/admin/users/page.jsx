import Link from "next/link";
import { Users } from "lucide-react";
import UserAdminActions from "@/components/admin/UserAdminActions";
import FilterTabs from "@/components/dashboard/FilterTabs";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { formatDate } from "@/lib/format";
import { storeUrl } from "@/lib/routes";
import { requireAdmin } from "@/server/auth/guards";
import { listUsers } from "@/server/services/userService";
import { parsePagination, readParam } from "@/server/validators/parse";

export const metadata = { title: "Users" };

const TABS = [
  { value: "all", label: "All" },
  { value: "sellers", label: "Sellers" },
  { value: "admins", label: "Admins" },
  { value: "suspended", label: "Suspended" },
];

function pageUrl({ filter, q, page }) {
  const params = new URLSearchParams();
  if (filter && filter !== "all") params.set("filter", filter);
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/users?${query}` : "/admin/users";
}

export default async function AdminUsersPage({ searchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const filter = TABS.some((tab) => tab.value === readParam(params, "filter")) ? readParam(params, "filter") : "all";
  const q = readParam(params, "q").trim().slice(0, 80);
  const { page } = parsePagination(params);
  const { users, total, pageCount } = await listUsers({ q, filter, page });

  return (
    <>
      <PageHeader title="Users" description={`${total} ${total === 1 ? "account" : "accounts"}.`} />

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs tabs={TABS.map((tab) => ({ ...tab, href: pageUrl({ filter: tab.value, q }) }))} active={filter} label="Filter users" />
        <form action="/admin/users" className="flex gap-2">
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          <label htmlFor="admin-user-search" className="sr-only">
            Search users
          </label>
          <input
            id="admin-user-search"
            name="q"
            defaultValue={q}
            placeholder="Name, email or store"
            maxLength={80}
            className="h-10 w-56 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-ink/60"
          />
          <Button type="submit" variant="secondary" size="sm" className="h-10">
            Search
          </Button>
        </form>
      </div>

      <div className="mt-6">
        <DataTable
          rows={users}
          getRowKey={(user) => user.id}
          caption="Users"
          columns={[
            {
              key: "user",
              header: "User",
              render: (user) => (
                <div>
                  <p className="font-medium text-ink">{user.name}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              ),
            },
            {
              key: "roles",
              header: "Roles",
              render: (user) => (
                <div className="flex flex-wrap gap-1">
                  {user.role === "admin" ? <Badge tone="accent">Admin</Badge> : <Badge>Buyer</Badge>}
                  {user.seller && <Badge tone={user.seller.status === "active" ? "info" : "danger"}>Seller{user.seller.status === "suspended" && " (suspended)"}</Badge>}
                  {user.status === "suspended" && <Badge tone="danger">Suspended</Badge>}
                </div>
              ),
            },
            {
              key: "store",
              header: "Store",
              render: (user) =>
                user.seller ? (
                  <Link href={storeUrl(user.seller.storeSlug)} className="hover:underline">
                    {user.seller.storeName}
                  </Link>
                ) : (
                  <span className="text-muted">None</span>
                ),
            },
            { key: "joined", header: "Joined", render: (user) => formatDate(user.createdAt) },
            {
              key: "actions",
              header: <span className="sr-only">Actions</span>,
              className: "text-right",
              render: (user) => <UserAdminActions user={user} isSelf={user.id === String(admin._id)} />,
            },
          ]}
          empty={<EmptyState icon={Users} title="No users found" description="Try a different search or filter." />}
        />
        <Pagination page={page} pageCount={pageCount} hrefForPage={(n) => pageUrl({ filter, q, page: n })} />
      </div>
    </>
  );
}
