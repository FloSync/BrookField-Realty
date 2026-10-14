import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Brookfield Realty & Investment Ltd.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy policy"
        description="Placeholder content — Brookfield's approved privacy policy will replace this text before launch."
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16 md:py-20 prose prose-sm text-slate">
        <p>
          This page is a frontend placeholder. It will describe how Brookfield
          Realty &amp; Investment Ltd. collects, uses, and protects personal
          data once legal review is complete.
        </p>
      </section>
    </>
  );
}
