import fs from "fs";
import path from "path";
import { sectionBackgrounds } from "./section-backgrounds";

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  legacyUrl: string;
  imageUrl?: string;
}

const posts: BlogPostMeta[] = [
  {
    slug: "massive-roi-why-you-should-invest-now-in-free-zone-city",
    title: "Massive ROI. Why you should invest now in Free Zone City",
    date: "2026-08-14",
    excerpt:
      "Free Zone City in Ibeju-Lekki offers proximity to the Lekki Free Trade Zone, deep seaport, Dangote Refinery and La Campagne Tropicana.",
    legacyUrl:
      "https://brookfieldrealtorltd.com/massive-roi-why-you-should-invest-now-in-free-zone-city/",
    imageUrl:
      sectionBackgrounds.blogFeatured[
        "massive-roi-why-you-should-invest-now-in-free-zone-city"
      ],
  },
  {
    slug: "green-brooks-garden-a-wise-investment-in-serenity-and-growth",
    title: "Green Brooks Garden: A Wise Investment in Serenity and Growth",
    date: "2026-02-08",
    excerpt:
      "Green Brooks Garden in Abijo GRA, Ibeju Lekki — strategic location, estate features and investment context.",
    legacyUrl:
      "https://brookfieldrealtorltd.com/green-brooks-garden-a-wise-investment-in-serenity-and-growth/",
    imageUrl:
      sectionBackgrounds.blogFeatured[
        "green-brooks-garden-a-wise-investment-in-serenity-and-growth"
      ],
  },
];

/** Homepage-linked titles not found as published WordPress posts — preserved as stubs. */
export const legacyBlogTeasers = [
  {
    title: "Investing in Ibeju-Lekki. (Top mistakes to avoid in 2027)",
    note: "Referenced on the legacy homepage; full article was not available in the WordPress export.",
  },
  {
    title: "The new Lagos. (A message to Nigerians in Diaspora)",
    note: "Referenced on the legacy homepage; full article was not available in the WordPress export.",
  },
];

export function getBlogPosts(): BlogPostMeta[] {
  return posts;
}

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getBlogPostHtml(slug: string): string | null {
  const file = path.join(process.cwd(), "src/lib/migrated", `post-${slug}.html`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}
