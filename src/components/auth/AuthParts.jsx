"use client";

import { Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLogout } from "@/hooks/useLogout";
import { getPasswordStrength } from "@/lib/validation";
import { useAuthStore } from "@/store/authStore";

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
      {visible ? <EyeOff className="size-4.5" aria-hidden="true" /> : <Eye className="size-4.5" aria-hidden="true" />}
    </button>
  );
}

const STRENGTH_COLORS = ["bg-sand", "bg-danger", "bg-warning", "bg-info", "bg-success"];

export function PasswordStrength({ password }) {
  const { score, label } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={`h-1 flex-1 rounded-full transition-colors ${score >= step ? STRENGTH_COLORS[score] : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Password strength: <span className="font-medium text-ink">{label}</span>
      </p>
    </div>
  );
}

export function SignedInNotice({ redirectTo }) {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <p className="text-[15px] text-ink">
        You&apos;re signed in as <span className="font-medium">{user.name}</span>{" "}
        <span className="text-muted">({user.email})</span>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href={redirectTo}>Continue</Button>
        <Button variant="secondary" onClick={() => logout({ redirectTo: null })}>
          Use a different account
        </Button>
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
