"use client";

import { useEffect } from "react";
import { AUTH_CHANNEL, useAuthStore } from "@/store/authStore";
import { CART_STORAGE_KEY, useCartStore } from "@/store/cartStore";

// Keys written by the previous version of the app (a JWT in localStorage and an id-only cart).
const LEGACY_STORAGE_KEYS = ["em_auth", "em_cart"];

/** Loads client state once on startup and keeps it in sync with other tabs. Renders nothing. */
export default function AppBootstrap() {
  useEffect(() => {
    try {
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Storage unavailable (private mode): nothing to clean up.
    }

    useCartStore.persist.rehydrate();
    useAuthStore.getState().refresh();

    const onStorage = (event) => {
      if (event.key === CART_STORAGE_KEY) useCartStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);

    let channel;
    try {
      channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.onmessage = () => useAuthStore.getState().refresh();
    } catch {
      channel = null;
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  return null;
}
