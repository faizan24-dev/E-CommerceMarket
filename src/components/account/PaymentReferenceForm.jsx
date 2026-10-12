"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

/** Lets the buyer submit their bank transfer reference so an admin can match the payment. */
export default function PaymentReferenceForm({ orderId, initialReference = "" }) {
  const [reference, setReference] = useState(initialReference);
  const { run, isPending, errorMessage, fieldErrors } = useAsyncAction();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaved(false);
    const result = await run(() => api.post(`/orders/${orderId}/payment`, { reference }));
    if (result) setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
      {saved && <Alert tone="success">Thanks! We&apos;ll confirm your payment shortly.</Alert>}
      <TextField
        id="reference"
        label="Transaction reference"
        hint="The reference or ID shown in your banking app after the transfer."
        value={reference}
        onChange={(event) => setReference(event.target.value)}
        maxLength={120}
        required
        error={fieldErrors.reference}
      />
      <Button type="submit" icon={Send} isLoading={isPending}>
        {initialReference ? "Update reference" : "Submit payment reference"}
      </Button>
    </form>
  );
}
