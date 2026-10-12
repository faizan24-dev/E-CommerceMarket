"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  LayoutDashboard,
  Library,
  Package,
  Receipt,
  Settings,
  Store,
  Users,
  Wallet,
} from "lucide-react";

// Defined here (not passed from the server) because icon components can't cross the server/client boundary.
const NAV = {
  account: [
    { href: "/account", label: "Library", icon: Library, exact: true },
    { href: "/account/orders", label: "Orders", icon: Receipt },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ],
  sell: [
    { href: "/sell", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/sell/products", label: "Products", icon: Package },
    { href: "/sell/sales", label: "Sales", icon: BadgeDollarSign },
    { href: "/sell/payouts", label: "Payouts", icon: Wallet },
    { href: "/sell/settings", label: "Store settings", icon: Store },
  ],
  admin: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: Receipt },
    { href: "/admin/payouts", label: "Payouts", icon: Wallet },
    { href: "/admin/users", label: "Users", icon: Users },
  ],
};

export default function DashboardNav({ area }) {
  const pathname = usePathname();
  return (
    <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
      {NAV[area].map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
                isActive ? "bg-ink font-medium text-white" : "text-ink-soft hover:bg-cream hover:text-ink"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
