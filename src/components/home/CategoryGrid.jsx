import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import SectionHeading from "@/components/ui/SectionHeading";
import { pluralize } from "@/lib/format";
import { productsUrl } from "@/lib/routes";

/** `counts` maps a category slug to its number of published products. */
export default function CategoryGrid({ counts = {} }) {
  return (
    <section id="categories" className="mx-auto max-w-[90rem] scroll-mt-32 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Hand-picked digital goods for makers, founders and teams, organized the way you work."
        action={{ href: "/products", label: "View all products" }}
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={productsUrl({ category: category.slug })}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-sand"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-x-2 bottom-2 flex items-end justify-between gap-2 rounded-xl bg-white/95 p-3 text-ink sm:inset-x-3 sm:bottom-3 sm:p-4">
              <div className="min-w-0">
                <h3 className="font-serif text-lg sm:text-2xl">{category.name}</h3>
                <p className="mt-1 hidden text-sm text-muted sm:block">{category.tagline}</p>
                <p className="mt-1 text-xs text-muted">{pluralize(counts[category.slug] ?? 0, "product")}</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
