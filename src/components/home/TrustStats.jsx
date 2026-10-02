import { trustStats } from "@/data/mockData";
import { getStoreStats } from "@/lib/catalog";

/** Minimal 4-column stat bar. */
export default function TrustStats() {
  const { averageRating } = getStoreStats();
  const stats = trustStats.map((stat) =>
    stat.id === "rating" ? { ...stat, value: `${averageRating.toFixed(1)} / 5.0` } : stat,
  );

  return (
    <section aria-label="Ecommerce Market in numbers" className="mx-auto max-w-[90rem] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
      <dl className="grid grid-cols-2 gap-y-8 rounded-3xl border border-line bg-white px-6 py-8 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-line lg:px-0 lg:py-10">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center px-2 text-center lg:px-6">
            <dt className="order-2 mt-2 text-xs text-muted sm:text-sm">{stat.label}</dt>
            <dd className="order-1 font-serif text-3xl tracking-tight text-ink sm:text-4xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
