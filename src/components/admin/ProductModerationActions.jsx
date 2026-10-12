"use client";

import { Check, EyeOff, Star, StarOff, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

/** Approve, reject (with feedback), unpublish and feature products. */
export default function ProductModerationActions({ product }) {
  const { run, isPending, errorMessage } = useAsyncAction();
  const moderate = (action, note) => run(() => api.patch(`/admin/products/${product.id}`, { action, note }));

  function reject() {
    const note = window.prompt("What should the seller change? This is shown to them.");
    if (note?.trim()) moderate("reject", note.trim().slice(0, 500));
  }

  function unpublish() {
    const note = window.prompt("Reason for removing it from the shop (optional):", "");
    if (note !== null) moderate("unpublish", note.trim().slice(0, 500) || undefined);
  }

  const canApprove = product.status === "pending" || product.status === "rejected" || product.status === "archived";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        {canApprove && (
          <Button size="sm" icon={Check} onClick={() => moderate("approve")} disabled={isPending}>
            {product.status === "archived" ? "Republish" : "Approve"}
          </Button>
        )}
        {product.status === "pending" && (
          <Button size="sm" variant="danger-outline" icon={X} onClick={reject} disabled={isPending}>
            Reject
          </Button>
        )}
        {product.status === "published" && (
          <>
            <Button
              size="sm"
              variant="secondary"
              icon={product.isFeatured ? StarOff : Star}
              onClick={() => moderate(product.isFeatured ? "unfeature" : "feature")}
              disabled={isPending}
            >
              {product.isFeatured ? "Unfeature" : "Feature"}
            </Button>
            <Button size="sm" variant="danger-outline" icon={EyeOff} onClick={unpublish} disabled={isPending}>
              Unpublish
            </Button>
          </>
        )}
      </div>
      {errorMessage && <p className="text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}
