import Link from "next/link";
import { blogPosts } from "@/data/mockData";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog",
  description: "Guides, studio stories and practical ideas for making and selling digital products.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Blog</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">The Journal</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
          Ideas for makers and the people who buy from them
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          Guides, studio stories and practical advice on creating, pricing and selling digital work.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <BlogCard key={post.slug} post={post} priority={index < 3} />
        ))}
      </div>
    </div>
  );
}
