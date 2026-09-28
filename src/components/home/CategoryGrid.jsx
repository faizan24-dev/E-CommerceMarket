import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/mockData";
import { countProductsInCategory } from "@/lib/catalog";
import SectionHeading from "./SectionHeading";

export default function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-[90rem] scroll-mt-32 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Hand-picked digital goods for makers, founders and teams, organized the way you work."
        action={{ href: "/products", label: "View all products" }}
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category) => {
          const count = countProductsInCategory(category.name);
          return (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-sand"
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl">{category.name}</h3>
                  <p className="mt-1 hidden text-sm text-white/80 sm:block">{category.tagline}</p>
                  <p className="mt-1 text-xs text-white/70">
                    {count} {count === 1 ? "product" : "products"}
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
