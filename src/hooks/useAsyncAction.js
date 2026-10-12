"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Runs an async action (usually an API call) and tracks its pending and error
 * state for buttons and forms. After success it refreshes Server Component data
 * on the current page, unless `refresh: false`.
 *
 *   const { run, isPending, error } = useAsyncAction();
 *   <Button onClick={() => run(() => api.patch(...))} isLoading={isPending} />
 */
export function useAsyncAction({ refresh = true } = {}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  async function run(action) {
    setIsPending(true);
    setError(null);
    try {
      const result = await action();
      if (refresh) router.refresh();
      return result;
    } catch (caught) {
      setError(caught);
      return undefined;
    } finally {
      setIsPending(false);
    }
  }

  return { run, isPending, error, errorMessage: error?.message ?? "", fieldErrors: error?.fieldErrors ?? {}, reset: () => setError(null) };
}
