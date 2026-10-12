import AboutSection from "@/components/home/AboutSection";
import FaqSection from "@/components/home/FaqSection";
import Testimonials from "@/components/home/Testimonials";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Container from "@/components/ui/Container";
import { testimonials } from "@/content/home";
import { preparePageData } from "@/server/page";
import { getCatalogStats, getPublishedProductsBySlugs } from "@/server/services/productService";

export const metadata = {
  title: "About us",
  description: "The story behind Ecommerce Market, a curated marketplace for templates, e-books, software and graphics.",
};

export default async function AboutPage() {
  await preparePageData();
  const [stats, linked] = await Promise.all([
    getCatalogStats(),
    getPublishedProductsBySlugs(testimonials.map((t) => t.productSlug)),
  ]);
  const productTitles = Object.fromEntries(linked.map((p) => [p.slug, p.title]));

  return (
    <>
      <Container className="pb-4 pt-10 lg:pt-14">
        <Breadcrumbs items={[{ label: "About us" }]} />
        <header className="mt-6 max-w-3xl pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Our story</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Thoughtfully made tools, delivered the moment you need them.
          </h1>
        </header>
      </Container>
      <AboutSection stats={stats} showLink={false} />
      <Testimonials stats={stats} productTitles={productTitles} />
      <FaqSection />
    </>
  );
}
