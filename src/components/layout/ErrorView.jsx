"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Fallback UI for error boundaries (error.jsx files). In production, errors
 * thrown on the server arrive with a generic message and a digest that matches
 * the server log entry, so no internals are shown to visitors.
 */
export default function ErrorView({ error, retry, title = "Something went wrong" }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-serif text-3xl text-ink">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        We couldn&apos;t load this page. This is usually temporary, so please try again. If it keeps happening, contact
        support{error?.digest ? ` and mention reference ${error.digest}` : ""}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()} icon={RotateCcw}>
          Try again
        </Button>
        <Button href="/" variant="secondary">
          Go to home page
        </Button>
      </div>
    </div>
  );
}
