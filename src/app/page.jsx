import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ValueProps from "@/components/home/ValueProps";
import SellerBanner from "@/components/home/SellerBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <ValueProps />
      <SellerBanner />
    </>
  );
}
