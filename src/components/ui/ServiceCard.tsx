import Link from "next/link";
import type { ServiceItem } from "@/lib/site-content";

export function ServiceCard({
  service,
  translucent = false,
}: {
  service: ServiceItem;
  /** Lets a page background (e.g. logo watermark) show through slightly. */
  translucent?: boolean;
}) {
  return (
    <article
      className={`border hairline p-6 h-full hover:shadow-md transition-shadow ${
        translucent ? "bg-white/65 backdrop-blur-[1px]" : "bg-white"
      }`}
    >
      <h3 className="font-serif text-xl text-ink">{service.title}</h3>
      <p className="mt-3 text-sm text-slate leading-relaxed">{service.description}</p>
      <Link
        href={service.href}
        className="mt-5 inline-block text-sm text-brass hover:underline underline-offset-4"
      >
        Learn more
      </Link>
    </article>
  );
}
