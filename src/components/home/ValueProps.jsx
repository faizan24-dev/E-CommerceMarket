import { BadgeCheck, Download, Headset, ShieldCheck } from "lucide-react";
import { valueProps } from "@/data/mockData";

const icons = {
  instant: Download,
  quality: BadgeCheck,
  support: Headset,
  secure: ShieldCheck,
};

/**
 * Compact feature band directly below the hero. The light background runs
 * edge to edge; the four items stay aligned with the page content.
 */
export default function ValueProps() {
  return (
    <section
      id="why-us"
      aria-label="Why shop with Ecommerce Market"
      className="mt-10 w-full scroll-mt-32 border-y border-line bg-canvas sm:mt-12"
    >
      <ul className="mx-auto grid max-w-[90rem] grid-cols-2 gap-y-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-line lg:px-10 lg:py-10">
        {valueProps.map((item) => {
          const Icon = icons[item.id];
          return (
            <li key={item.id} className="group flex flex-col items-center px-3 text-center lg:px-6">
              <span className="flex size-10 items-center justify-center rounded-full border border-ink/20 text-ink-soft transition-colors duration-300 group-hover:border-ink group-hover:bg-cream group-hover:text-ink">
                <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold tracking-tight text-ink sm:text-[15px]">{item.title}</h3>
              <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-muted sm:text-[13px]">
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
