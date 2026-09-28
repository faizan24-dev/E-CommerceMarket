"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Small "Logging you out…" card centered on screen while logout is in progress. */
export default function LogoutOverlay() {
  const { isLoggingOut } = useAuth();
  if (!isLoggingOut) return null;

  return (
    // Transparent layer: the page stays fully visible, but clicks are ignored until logout finishes.
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        role="status"
        aria-live="assertive"
        className="flex w-full max-w-xs animate-pop-in flex-col motion-reduce:animate-none items-center rounded-2xl border border-line bg-white px-8 py-7 text-center shadow-[0_24px_60px_-18px_rgba(28,27,25,0.45)]"
      >
        <Loader2 className="size-7 animate-spin text-accent" strokeWidth={1.75} aria-hidden="true" />
        <p className="mt-3 font-serif text-xl text-ink">Logging you out…</p>
        <p className="mt-1 text-sm text-muted">See you again soon.</p>
      </div>
    </div>
  );
}
