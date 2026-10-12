"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";
import { formatMoney } from "@/lib/format";

/**
 * Records a payout after the admin has sent the money. Clears the seller's
 * unpaid balance; the transfer reference is saved for both sides to see.
 */
export default function RecordPayoutForm({ sellerId, amount, disabled }) {
  const [values, setValues] = useState({ reference: "", note: "" });
  const { run, isPending, errorMessage, fieldErrors } = useAsyncAction();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!window.confirm(`Mark ${formatMoney(amount)} as paid to this seller? Only do this after sending the transfer.`)) return;
    await run(() => api.post("/admin/payouts", { sellerId, reference: values.reference, note: values.note || undefined }));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          id={`reference-${sellerId}`}
          label="Transfer reference"
          placeholder="Bank transaction ID"
          value={values.reference}
          onChange={(event) => setValues((v) => ({ ...v, reference: event.target.value }))}
          error={fieldErrors.reference}
          disabled={disabled}
        />
        <TextField
          id={`note-${sellerId}`}
          label="Note (optional)"
          value={values.note}
          onChange={(event) => setValues((v) => ({ ...v, note: event.target.value }))}
          disabled={disabled}
        />
      </div>
      <Button type="submit" icon={CircleCheck} isLoading={isPending} disabled={disabled}>
        Mark {formatMoney(amount)} as paid
      </Button>
    </form>
  );
}
