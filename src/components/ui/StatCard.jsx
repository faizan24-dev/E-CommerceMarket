/** A labelled number for dashboards. `icon` is a lucide component. */
export default function StatCard({ label, value, hint, icon: Icon, tone = "default" }) {
  const toneClass = { default: "text-ink", success: "text-success", warning: "text-warning", accent: "text-accent" }[tone];
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {Icon && <Icon className="size-4 text-muted" strokeWidth={1.75} aria-hidden="true" />}
      </div>
      <p className={`mt-3 font-serif text-3xl tracking-tight ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
