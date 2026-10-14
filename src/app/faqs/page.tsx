import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { CTASection } from "@/components/ui/CTASection";
import { getFAQs } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "FAQs | Brookfield Realty & Investment Ltd.",
};

export default function FAQsPage() {
  const faqs = getFAQs();

  return (
    <>
      <PageHeader
        title="Frequently asked questions"
        description="Answers to the questions we hear most often from buyers and investors."
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <p className="text-sm text-slate mb-8">
          Questions and answers preserved from brookfieldrealtorltd.com/faq (legacy placeholder answers included verbatim).
        </p>
        <FAQAccordion items={faqs} />
      </section>

      <CTASection
        title="Still have a question?"
        description="Send us a message and our team will respond within one business day."
        primaryLabel="Contact us"
        primaryHref="/contact"
      />
    </>
  );
}
