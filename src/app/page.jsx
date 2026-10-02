import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import CuratedCollections from "@/components/home/CuratedCollections";
import SpotlightBanner from "@/components/home/SpotlightBanner";
import TrustStats from "@/components/home/TrustStats";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ValueProps from "@/components/home/ValueProps";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import SellerBanner from "@/components/home/SellerBanner";

// About Us and Blog live on their own pages (/about and /blog).
export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <CuratedCollections />
      <SpotlightBanner />
      <TrustStats />
      <FeaturedProducts />
      <Testimonials />
      <FaqSection />
      <SellerBanner />
    </>
  );
}
