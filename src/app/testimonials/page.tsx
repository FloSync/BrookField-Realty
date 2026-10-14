import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { CTASection } from "@/components/ui/CTASection";
import { getTestimonials } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Testimonials | Brookfield Realty & Investment Ltd.",
};

export default function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Demo testimonials for layout preview only — not verified customer reviews."
        crumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      <CTASection
        title="Start your own property search"
        primaryLabel="Browse properties"
        primaryHref="/properties"
      />
    </>
  );
}
