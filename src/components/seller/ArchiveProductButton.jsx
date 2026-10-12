"use client";

import { Archive } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api } from "@/lib/apiClient";

/** Removes a product from the shop. Buyers keep access to files they already bought. */
export default function ArchiveProductButton({ productId, title }) {
  const { run, isPending, errorMessage } = useAsyncAction();

  function handleClick() {
    if (!window.confirm(`Remove "${title}" from the shop? People who bought it keep their downloads.`)) return;
    run(() => api.delete(`/products/${productId}`));
  }

  return (
    <>
      <Button variant="ghost" size="sm" icon={Archive} onClick={handleClick} isLoading={isPending} title="Archive">
        Archive
      </Button>
      {errorMessage && <span className="block text-xs text-danger">{errorMessage}</span>}
    </>
  );
}
