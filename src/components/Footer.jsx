import Link from "next/link";
import { Lock } from "lucide-react";
import { footerLinks } from "@/data/mockData";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A curated marketplace for digital goods: templates, software, e-books and graphics from
              independent creators, delivered the moment you check out.
            </p>
            <div className="mt-8 max-w-md">
              <h2 className="font-serif text-xl text-ink">Get new drops in your inbox</h2>
              <p className="mb-4 mt-1 text-sm text-muted">
                One thoughtful email a week. Unsubscribe anytime.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted transition hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sand pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Ecommerce Market. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" /> Secure checkout · Instant digital delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
