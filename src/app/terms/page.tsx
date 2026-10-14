import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Terms & Conditions | Brookfield Realty & Investment Ltd.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & conditions"
        description="Placeholder content — Brookfield's approved terms will replace this text before launch."
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20 prose prose-sm text-slate">
        <p>
          This page is a frontend placeholder. It will set out website usage
          terms, listing disclaimers, and enquiry policies once approved by
          Brookfield.
        </p>
      </section>
    </>
  );
}
