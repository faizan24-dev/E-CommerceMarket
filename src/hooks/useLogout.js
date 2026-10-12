"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/** Logs out, then navigates (home by default; pass `redirectTo: null` to stay) and refreshes server data. */
export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return async function logoutAndRedirect({ redirectTo = "/" } = {}) {
    await logout();
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  };
}
