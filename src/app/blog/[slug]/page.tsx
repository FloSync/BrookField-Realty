import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import Image from "next/image";
import { getBlogPosts, getBlogPost, getBlogPostHtml } from "@/lib/blog-data";
import { BLOG_CARD_IMAGE_QUALITY } from "@/lib/property-image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return { title: post ? `${post.title} | Brookfield Realty` : "Article not found" };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const html = getBlogPostHtml(slug);

  return (
    <>
      <PageHeader
        title={post.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
      />
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {post.imageUrl && (
          <div className="relative aspect-[16/10] mb-8 border hairline overflow-hidden">
            <Image
              src={post.imageUrl}
              alt=""
              fill
              priority
              quality={BLOG_CARD_IMAGE_QUALITY}
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-center"
            />
          </div>
        )}
        <time className="text-sm text-slate" dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
        {html ? (
          <div
            className="prose prose-sm md:prose-base max-w-none mt-6 text-ink-soft [&_img]:max-w-full [&_img]:h-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mt-6 text-slate leading-relaxed">{post.excerpt}</p>
        )}
        <p className="mt-10 text-xs text-slate">
          Originally published on{" "}
          <a href={post.legacyUrl} className="text-brass hover:underline" target="_blank" rel="noopener noreferrer">
            brookfieldrealtorltd.com
          </a>
        </p>
        <Link href="/blog" className="mt-6 inline-block text-sm text-brass hover:underline">
          ← Back to blog
        </Link>
      </article>
    </>
  );
}
