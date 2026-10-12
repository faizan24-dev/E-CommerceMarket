/** Centered placeholder for empty lists and missing content. `icon` is a lucide component. */
export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div className={`mx-auto flex max-w-md flex-col items-center px-4 py-14 text-center ${className}`}>
      {Icon && (
        <span className="flex size-14 items-center justify-center rounded-full bg-cream">
          <Icon className="size-6 text-muted" strokeWidth={1.5} aria-hidden="true" />
        </span>
      )}
      <h2 className="mt-5 font-serif text-2xl text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
