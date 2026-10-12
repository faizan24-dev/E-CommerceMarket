import AboutSection from "@/components/home/AboutSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import CuratedCollections from "@/components/home/CuratedCollections";
import FaqSection from "@/components/home/FaqSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import SellerBanner from "@/components/home/SellerBanner";
import SpotlightBanner from "@/components/home/SpotlightBanner";
import Testimonials from "@/components/home/Testimonials";
import TrustStats from "@/components/home/TrustStats";
import ValueProps from "@/components/home/ValueProps";
import { heroSlides, testimonials } from "@/content/home";
import { preparePageData } from "@/server/page";
import {
  getCatalogStats,
  getPublishedProductsBySlugs,
  listPublishedProducts,
} from "@/server/services/productService";

export default async function HomePage() {
  await preparePageData();

  const linkedSlugs = [...new Set([...heroSlides.map((s) => s.productSlug), ...testimonials.map((t) => t.productSlug)])];
  const [stats, linkedProducts, featured, staffPicks, freebies] = await Promise.all([
    getCatalogStats(),
    getPublishedProductsBySlugs(linkedSlugs),
    listPublishedProducts({ free: false, sort: "featured", limit: 8 }),
    listPublishedProducts({ featured: true, limit: 5 }),
    listPublishedProducts({ free: true, limit: 1 }),
  ]);
  const productTitles = Object.fromEntries(linkedProducts.map((p) => [p.slug, p.title]));

  return (
    <>
      <Hero products={linkedProducts} />
      <ValueProps />
      <CategoryGrid counts={stats.countsByCategory} />
      <CuratedCollections staffPicks={staffPicks.products.slice(0, 4)} freebie={freebies.products[0]} />
      <SpotlightBanner product={staffPicks.products.find((p) => p.price > 0)} />
      <TrustStats averageRating={stats.averageRating} />
      <FeaturedProducts products={featured.products} />
      <Testimonials stats={stats} productTitles={productTitles} />
      <AboutSection stats={stats} />
      <FaqSection />
      <SellerBanner />
    </>
  );
}
