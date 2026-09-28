import { CircleAlert } from "lucide-react";

export default function FormField({
  id,
  label,
  error,
  hint,
  labelAside,
  trailing,
  ref,
  className = "",
  ...inputProps
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative mt-1.5">
        <input
          ref={ref}
          id={id}
          name={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`block h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:ring-4 ${
            error
              ? "border-danger focus:ring-danger/10"
              : "border-line hover:border-ink/30 focus:border-ink/60 focus:ring-ink/5"
          } ${trailing ? "pr-12" : ""}`}
          {...inputProps}
        />
        {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
