import { LayoutDashboard, Library, Receipt, Settings, ShieldCheck, Store } from "lucide-react";

/** Links shown in the account dropdown and mobile menu, depending on the user's roles. */
export function getAccountLinks(user) {
  const isAdmin = user?.role === "admin";
  const isSeller = user?.seller?.status === "active";
  return [
    { href: "/account", label: "My library", icon: Library },
    { href: "/account/orders", label: "Orders", icon: Receipt },
    isSeller || isAdmin
      ? { href: "/sell", label: "Seller dashboard", icon: LayoutDashboard }
      : { href: "/sell", label: "Start selling", icon: Store },
    ...(isAdmin ? [{ href: "/admin", label: "Admin panel", icon: ShieldCheck }] : []),
    { href: "/account/settings", label: "Account settings", icon: Settings },
  ];
}
