"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PAYOUT_METHOD_TYPES } from "@/config/marketplace";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

const TYPE_OPTIONS = Object.entries(PAYOUT_METHOD_TYPES).map(([value, config]) => ({ value, label: config.label }));

/**
 * Where the seller wants to receive their earnings. The current method is
 * shown masked; the full account number is never sent back to the browser.
 */
export default function PayoutMethodForm({ current }) {
  const [values, setValues] = useState({
    type: current?.type ?? "bank_transfer",
    accountHolder: current?.accountHolder ?? "",
    provider: current?.provider ?? "",
    accountNumber: "",
    notes: current?.notes ?? "",
  });
  const [saved, setSaved] = useState(false);
  const { run, isPending, errorMessage, fieldErrors } = useAsyncAction();
  const labels = PAYOUT_METHOD_TYPES[values.type];

  function handleChange(event) {
    setValues((state) => ({ ...state, [event.target.name]: event.target.value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await run(() => api.put("/seller/payout-method", values));
    if (result) {
      setSaved(true);
      setValues((state) => ({ ...state, accountNumber: "" }));
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      {saved && <Alert tone="success">Payout method saved.</Alert>}
      {current && (
        <p className="rounded-xl bg-canvas px-4 py-3 text-sm text-ink-soft">
          Current: {PAYOUT_METHOD_TYPES[current.type]?.label} | {current.provider} | {current.accountHolder} | ending in{" "}
          <span className="font-mono font-semibold">{current.accountLast4}</span>
        </p>
      )}
      <SelectField id="type" label="Method" value={values.type} onChange={handleChange} options={TYPE_OPTIONS} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="accountHolder"
          label="Account holder name"
          autoComplete="name"
          value={values.accountHolder}
          onChange={handleChange}
          error={fieldErrors.accountHolder}
        />
        <TextField
          id="provider"
          label={labels.providerLabel}
          value={values.provider}
          onChange={handleChange}
          error={fieldErrors.provider}
        />
      </div>
      <TextField
        id="accountNumber"
        label={labels.accountLabel}
        autoComplete="off"
        placeholder={current ? "Enter it again to update your details" : ""}
        value={values.accountNumber}
        onChange={handleChange}
        error={fieldErrors.accountNumber}
        hint="Stored encrypted. Only the platform admin can see it, to send your payouts."
      />
      <TextAreaField
        id="notes"
        label="Notes for the admin (optional)"
        rows={2}
        value={values.notes}
        onChange={handleChange}
        maxLength={300}
        hint="Branch code, SWIFT, or anything else needed for the transfer."
      />
      <Button type="submit" icon={Lock} isLoading={isPending}>
        Save payout method
      </Button>
    </form>
  );
}
