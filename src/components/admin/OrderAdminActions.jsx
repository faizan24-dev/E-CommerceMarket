"use client";

import { CircleCheck, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

/** Confirm a manual payment (unlocks downloads, credits sellers) or cancel an unpaid order. */
export default function OrderAdminActions({ orderId, compact = false }) {
  const { run, isPending, errorMessage } = useAsyncAction();
  const size = compact ? "sm" : "md";

  function confirmPayment() {
    if (!window.confirm("Confirm you received this payment? The buyer's downloads unlock and sellers are credited.")) return;
    run(() => api.patch(`/orders/${orderId}`, { action: "confirm" }));
  }

  function cancel() {
    const reason = window.prompt("Reason for cancelling (shown to the buyer):", "Payment not received");
    if (reason === null) return;
    run(() => api.patch(`/orders/${orderId}`, { action: "cancel", reason: reason.slice(0, 300) }));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button size={size} icon={CircleCheck} onClick={confirmPayment} isLoading={isPending}>
          Confirm payment
        </Button>
        <Button size={size} variant="danger-outline" icon={XCircle} onClick={cancel} disabled={isPending}>
          Cancel
        </Button>
      </div>
      {errorMessage && <p className="mt-2 text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}
