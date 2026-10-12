import { CircleAlert } from "lucide-react";

const controlBase =
  "block w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:ring-4 disabled:bg-canvas disabled:text-muted";

function controlClasses(error, extra = "") {
  return `${controlBase} ${
    error ? "border-danger focus:ring-danger/10" : "border-line hover:border-ink/30 focus:border-ink/60 focus:ring-ink/5"
  } ${extra}`;
}

/** Label, hint and error message around any form control. */
export function Field({ id, label, error, hint, labelAside, className = "", children }) {
  return (
    <div className={className}>
      {(label || labelAside) && (
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={id} className="text-sm font-medium text-ink">
            {label}
          </label>
          {labelAside}
        </div>
      )}
      <div className="relative mt-1.5">{children}</div>
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

function describedBy(id, error, hint) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

/** Text input with label and validation message. `trailing` renders inside the right edge (e.g. a show-password toggle). */
export function TextField({ id, label, error, hint, labelAside, trailing, className, ref, ...inputProps }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} labelAside={labelAside} className={className}>
      <input
        ref={ref}
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClasses(error, `h-12 ${trailing ? "pr-12" : ""}`)}
        {...inputProps}
      />
      {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
    </Field>
  );
}

export function TextAreaField({ id, label, error, hint, className, rows = 5, ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClasses(error, "py-3 leading-relaxed")}
        {...props}
      />
    </Field>
  );
}

/** `options` is a list of `{ value, label }`. */
export function SelectField({ id, label, error, hint, className, options, placeholder, ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <select
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClasses(error, "h-12 appearance-none pr-10")}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
