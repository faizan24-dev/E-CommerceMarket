"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/store/authStore";
import { getAccountLinks } from "./accountLinks";

const itemClass = "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink transition hover:bg-canvas";

export default function AccountMenu({ iconClassName, className = "" }) {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div
      className={`relative ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative flex rounded-full p-2 text-ink transition hover:bg-cream"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={user ? `Account menu for ${user.name}` : "Account"}
      >
        <UserRound className={iconClassName} strokeWidth={1.6} aria-hidden="true" />
        {user && (
          <span className="absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-success ring-2 ring-canvas" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-white py-2 shadow-[0_18px_50px_-12px_rgba(28,27,25,0.25)]"
        >
          {user ? (
            <>
              <div className="flex items-center gap-3 border-b border-line px-4 pb-3 pt-1">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              <div className="py-1">
                {getAccountLinks(user).map(({ href, label, icon: Icon }) => (
                  <Link key={href + label} href={href} role="menuitem" onClick={close} className={itemClass}>
                    <Icon className="size-4 text-muted" aria-hidden="true" /> {label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-line pt-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    logout();
                  }}
                  className={itemClass}
                >
                  <LogOut className="size-4 text-muted" aria-hidden="true" /> Log out
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 pb-2 pt-2">
              <p className="font-serif text-lg text-ink">Welcome</p>
              <p className="mt-0.5 text-xs text-muted">Log in to check out, download your files and sell your work.</p>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={close}
                  className="rounded-full bg-ink py-2.5 text-center text-sm font-medium text-white transition hover:bg-ink-soft"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  role="menuitem"
                  onClick={close}
                  className="rounded-full border border-line py-2.5 text-center text-sm font-medium text-ink transition hover:border-ink"
                >
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
