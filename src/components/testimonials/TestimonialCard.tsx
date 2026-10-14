import type { Testimonial } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="border hairline bg-white p-6 flex flex-col h-full">
      {testimonial.isDemo && (
        <p className="text-[10px] uppercase tracking-wide text-slate mb-3">
          Demo testimonial
        </p>
      )}
      <blockquote className="font-serif text-lg text-ink leading-snug flex-1">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-5 pt-5 border-t hairline">
        <p className="text-sm font-medium text-ink">{testimonial.name}</p>
        <p className="text-xs text-slate">{testimonial.role}</p>
      </figcaption>
    </figure>
  );
}
