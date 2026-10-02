import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/catalog";

export default function BlogCard({ post, priority = false }) {
  const href = `/blog/${post.slug}`;

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
        <Image
          src={post.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink shadow-sm">
          {post.category}
        </span>
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs text-muted">
          {formatDate(post.date)} <span aria-hidden="true">·</span> {post.readTime}
        </p>
        <h3 className="mt-2 font-serif text-xl leading-snug tracking-tight text-ink sm:text-[22px]">
          <Link href={href} className="decoration-1 underline-offset-4 hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="mb-5 mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <Link
          href={href}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink transition hover:border-ink"
          aria-label={`Read article: ${post.title}`}
        >
          Read article <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
