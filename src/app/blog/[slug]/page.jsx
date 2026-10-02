import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/mockData";
import { formatDate, getPostBySlug } from "@/lib/catalog";
import BlogCard from "@/components/BlogCard";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const morePosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-ink">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{post.category}</span>
      </nav>

      <article className="mt-8">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
            {post.category}
          </span>
          <h1 className="mt-5 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-sm text-muted">
            By <span className="font-medium text-ink">{post.author}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            {formatDate(post.date)}
            <span className="mx-2" aria-hidden="true">·</span>
            {post.readTime}
          </p>
        </header>

        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl bg-cream">
          <Image src={post.image} alt="" fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-6 text-[17px] leading-[1.8] text-ink-soft">
          <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl">{post.excerpt}</p>
          {post.content.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl border-t border-line pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
          >
            <ArrowLeft className="size-4" /> Back to all articles
          </Link>
        </div>
      </article>

      <section className="mt-20 border-t border-line pt-12">
        <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">More from the journal</h2>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {morePosts.map((item) => (
            <BlogCard key={item.slug} post={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
