"use client";

import { FileUp } from "lucide-react";
import { formatFileSize } from "@/lib/format";
import { Field } from "./Field";

/** A styled file picker. `file` is the currently selected File (or null); `current` describes an existing upload. */
export function FileField({ id, label, hint, error, accept, file, current, onChange, required }) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-center gap-4 rounded-xl border border-dashed bg-white px-4 py-4 transition hover:border-ink/40 focus-within:ring-4 focus-within:ring-ink/5 ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-canvas text-muted">
          <FileUp className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 text-sm">
          {file ? (
            <>
              <span className="block truncate font-medium text-ink">{file.name}</span>
              <span className="text-xs text-muted">{formatFileSize(file.size)} selected</span>
            </>
          ) : current ? (
            <>
              <span className="block truncate font-medium text-ink">{current}</span>
              <span className="text-xs text-muted">Click to replace</span>
            </>
          ) : (
            <>
              <span className="block font-medium text-ink">Choose a file</span>
              <span className="text-xs text-muted">{accept.replaceAll(",", ", ")}</span>
            </>
          )}
        </span>
        <input
          id={id}
          name={id}
          type="file"
          accept={accept}
          required={required}
          aria-invalid={Boolean(error)}
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </Field>
  );
}
