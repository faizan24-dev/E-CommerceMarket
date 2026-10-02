import Link from "next/link";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";

export const metadata = {
  title: "About us",
  description: "The story behind Ecommerce Market, a curated marketplace for templates, software, e-books and graphics.",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-[90rem] px-4 pb-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">About us</span>
        </nav>
        <header className="mt-6 max-w-3xl pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Our story</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Thoughtfully made tools, delivered the moment you need them.
          </h1>
        </header>
      </div>
      <AboutSection showLink={false} />
      <Testimonials />
      <FaqSection />
    </>
  );
}
