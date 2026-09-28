"use client";

import Link from "next/link";
import { CircleAlert, CircleCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Hands the new account's email from the sign-up page to the login page without putting it in the URL.
export const SIGNUP_EMAIL_KEY = "em_signup_email";

export function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg p-2 text-muted transition hover:bg-canvas hover:text-ink"
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
    >
      {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
    </button>
  );
}

export function FormAlert({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}

export function FormSuccess({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-2.5 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success"
    >
      <CircleCheck className="mt-0.5 size-4 shrink-0" />
      {message}
    </div>
  );
}

export function SubmitButton({ isSubmitting, isSuccess, children, submittingLabel, successLabel }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting || isSuccess}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-80"
    >
      {isSubmitting && <Loader2 className="size-4 animate-spin" />}
      {isSuccess ? successLabel : isSubmitting ? submittingLabel : children}
    </button>
  );
}

export function SignedInNotice({ redirectTo }) {
  const { user, logout } = useAuth();
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[15px] text-ink">
        You&apos;re signed in as <span className="font-medium">{user.name}</span>{" "}
        <span className="text-muted">({user.email})</span>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={redirectTo}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-soft"
        >
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={() => logout({ redirectTo: null })}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
        >
          Use a different account
        </button>
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 2 }) {
  return (
    <div className="animate-pulse space-y-5" aria-hidden="true">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i}>
          <div className="h-4 w-24 rounded bg-sand" />
          <div className="mt-2 h-12 rounded-xl bg-cream" />
        </div>
      ))}
      <div className="h-12 rounded-full bg-sand" />
    </div>
  );
}
