import { BadgeCheck, Download, Infinity as InfinityIcon } from "lucide-react";
import { valueProps } from "@/data/mockData";

const icons = {
  instant: Download,
  verified: BadgeCheck,
  lifetime: InfinityIcon,
};

export default function ValueProps() {
  return (
    <section id="why-us" aria-label="Why shop with Ecommerce Market" className="scroll-mt-32 border-y border-line bg-canvas">
      <div className="mx-auto grid max-w-[90rem] divide-y divide-line px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
        {valueProps.map((item) => {
          const Icon = icons[item.id];
          return (
            <div key={item.id} className="flex gap-4 py-8 md:px-8 md:py-12 md:first:pl-0 md:last:pr-0">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-white">
                <Icon className="size-5 text-accent" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
