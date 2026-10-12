"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { validateEmail } from "@/lib/validation";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (!message) setIsSubscribed(true);
  }

  if (isSubscribed) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm text-success" role="status">
        <CircleCheck className="size-4 shrink-0" />
        Thanks! {email.trim()} is on the list for new drops.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div
        className={`flex h-12 items-center rounded-full border bg-white pl-5 pr-1.5 transition focus-within:border-ink/50 ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError("");
          }}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink-soft"
        >
          Subscribe <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 pl-5 text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
