import Image from "next/image";
import { Quote } from "lucide-react";
import { authImage } from "@/content/images";

export default function AuthLayout({ title, subtitle, quote, children }) {
  return (
    <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10">
      <div className="relative hidden min-h-[36rem] overflow-hidden rounded-3xl bg-sand lg:block">
        <Image src={authImage} alt="" fill priority sizes="(min-width: 1024px) 45vw, 0px" className="object-cover" />
        {/* Solid card instead of a gradient scrim keeps the quote readable on any photo. */}
        <figure className="absolute inset-x-6 bottom-6 rounded-2xl bg-ink/85 p-8 text-white backdrop-blur-sm">
          <Quote className="size-6 text-accent-soft" aria-hidden="true" />
          <blockquote className="mt-3 font-serif text-2xl leading-snug">{quote.text}</blockquote>
          <figcaption className="mt-4 text-sm text-white/75">
            {quote.author} | {quote.role}
          </figcaption>
        </figure>
      </div>

      <div className="flex items-center justify-center lg:py-10">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl tracking-tight text-ink">{title}</h1>
          <p className="mt-2 text-[15px] text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
