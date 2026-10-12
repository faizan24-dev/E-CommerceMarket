import Container from "@/components/ui/Container";
import DashboardNav from "./DashboardNav";

/** Sidebar layout used by the buyer account, the seller dashboard and the admin panel. */
export default function DashboardShell({ area, title, subtitle, children }) {
  return (
    <Container className="py-8 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{title}</p>
          {subtitle && <p className="mt-1 truncate text-sm text-muted">{subtitle}</p>}
          <nav aria-label={title} className="mt-4">
            <DashboardNav area={area} />
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
