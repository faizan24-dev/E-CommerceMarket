"use client";

import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

/** Role and status controls for one user row. */
export default function UserAdminActions({ user, isSelf }) {
  const { run, isPending, errorMessage } = useAsyncAction();

  function update(changes, question) {
    if (!window.confirm(question)) return;
    run(() => api.patch(`/admin/users/${user.id}`, changes));
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        {!isSelf &&
          (user.role === "admin" ? (
            <Button size="sm" variant="secondary" disabled={isPending} onClick={() => update({ role: "user" }, `Remove admin access from ${user.name}?`)}>
              Remove admin
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={() => update({ role: "admin" }, `Give ${user.name} full admin access, including payouts and bank details?`)}
            >
              Make admin
            </Button>
          ))}
        {user.seller &&
          (user.seller.status === "active" ? (
            <Button
              size="sm"
              variant="danger-outline"
              disabled={isPending}
              onClick={() => update({ sellerStatus: "suspended" }, `Suspend ${user.seller.storeName}? They can't upload or sell until reinstated.`)}
            >
              Suspend shop
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled={isPending} onClick={() => update({ sellerStatus: "active" }, `Reinstate ${user.seller.storeName}?`)}>
              Reinstate shop
            </Button>
          ))}
        {!isSelf &&
          (user.status === "active" ? (
            <Button
              size="sm"
              variant="danger-outline"
              disabled={isPending}
              onClick={() => update({ status: "suspended" }, `Suspend ${user.name}'s account? They are signed out everywhere.`)}
            >
              Suspend account
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled={isPending} onClick={() => update({ status: "active" }, `Reactivate ${user.name}'s account?`)}>
              Reactivate
            </Button>
          ))}
      </div>
      {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}
