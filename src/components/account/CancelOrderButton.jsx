"use client";

import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

export default function CancelOrderButton({ orderId }) {
  const { run, isPending, errorMessage } = useAsyncAction();

  function handleClick() {
    if (!window.confirm("Cancel this order? You can place a new one any time.")) return;
    run(() => api.patch(`/orders/${orderId}`, { action: "cancel", reason: "Cancelled by buyer" }));
  }

  return (
    <div>
      <Button variant="danger-outline" icon={XCircle} onClick={handleClick} isLoading={isPending}>
        Cancel order
      </Button>
      {errorMessage && <p className="mt-2 text-xs text-danger">{errorMessage}</p>}
    </div>
  );
}
