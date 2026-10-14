import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts, legacyBlogTeasers } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | Brookfield Realty",
  description: "Real estate insights and investment articles from Brookfield Realty.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <>
      <PageHeader
        title="Blog"
        description="Investment, land and market updates from Brookfield Realty."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {legacyBlogTeasers.length > 0 && (
          <div className="mt-16 border-t hairline pt-10">
            <h2 className="font-serif text-2xl text-ink mb-4">
              Referenced on the legacy homepage
            </h2>
            <ul className="space-y-4">
              {legacyBlogTeasers.map((t) => (
                <li key={t.title} className="border hairline bg-parchment-dim p-5">
                  <p className="font-medium text-ink">{t.title}</p>
                  <p className="mt-1 text-sm text-slate">{t.note}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
