import { ProductGrid } from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedProducts({ products }) {
  if (!products.length) return null;
  return (
    <section id="featured" className="scroll-mt-32 border-t border-line bg-white">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="Featured"
          title="Featured digital products"
          description="This week's most-loved downloads, chosen for craft, usefulness and glowing reviews."
          action={{ href: "/products", label: "Shop everything" }}
        />
        <ProductGrid products={products} className="mt-10" />
      </div>
    </section>
  );
}
