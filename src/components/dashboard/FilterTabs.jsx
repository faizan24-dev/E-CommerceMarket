import Link from "next/link";

/** Link-based filter tabs (the filter lives in the URL, so it survives reloads and can be shared). */
export default function FilterTabs({ tabs, active, label = "Filter" }) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.value || "all"}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition ${
              isActive ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink/40"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs ${isActive ? "text-white/70" : "text-muted"}`}>{tab.count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
