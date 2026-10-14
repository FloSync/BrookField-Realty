import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog-data";
import { BLOG_CARD_IMAGE_QUALITY } from "@/lib/property-image";

export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <article className="border hairline bg-white flex flex-col h-full hover:shadow-md transition-shadow overflow-hidden">
      {post.imageUrl && (
        <div className="relative aspect-[16/10] bg-parchment-dim">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            quality={BLOG_CARD_IMAGE_QUALITY}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            className="object-cover object-center"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
      <time className="text-xs text-slate" dateTime={post.date}>
        {new Date(post.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>
      <h3 className="mt-2 font-serif text-lg text-ink leading-snug flex-1">
        <Link href={`/blog/${post.slug}`} className="hover:text-brass">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm text-slate line-clamp-3">{post.excerpt}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-5 text-sm text-brass hover:underline underline-offset-4"
      >
        Read More
      </Link>
      </div>
    </article>
  );
}
