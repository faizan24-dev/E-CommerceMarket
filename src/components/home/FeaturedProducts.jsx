import { products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "./SectionHeading";

export default function FeaturedProducts() {
  return (
    <section id="featured" className="scroll-mt-32 border-t border-line bg-white">
      <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="Featured"
          title="Featured digital products"
          description="This week's most-loved downloads, chosen for craft, usefulness and glowing reviews."
          action={{ href: "/products", label: "Shop everything" }}
        />
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
