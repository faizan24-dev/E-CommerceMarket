import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { faqs } from "@/data/mockData";

/**
 * Accordion built on native <details>: works without JavaScript, is keyboard
 * accessible, and `name` keeps only one answer open at a time.
 */
export default function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-24">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">FAQs</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink sm:text-4xl">Questions, answered</h2>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Everything you need to know about buying, downloading and using digital products.
          </p>
          <div className="mt-8 hidden max-w-sm rounded-2xl border border-line bg-white p-6 lg:block">
            <p className="font-serif text-lg text-ink">Can&apos;t find your answer?</p>
            <p className="mt-1 text-sm text-muted">Our guides cover setup, licences and selling in more depth.</p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition hover:decoration-ink"
            >
              Read the guides <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-line lg:col-span-8">
          {faqs.map((faq, index) => (
            <details key={faq.question} name="faq" open={index === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-lg leading-snug text-ink sm:text-xl">{faq.question}</span>
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white"
                  aria-hidden="true"
                >
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-6 pr-12 text-[15px] leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
