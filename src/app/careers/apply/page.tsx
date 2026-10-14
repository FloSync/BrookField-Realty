import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { getPublishedCareers } from "@/server/db/queries/careers";

export const metadata: Metadata = {
  title: "Apply | Brookfield Realty & Investment Ltd.",
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ jobId?: string; title?: string }>;
}

export default async function CareerApplyPage({ searchParams }: PageProps) {
  const { jobId, title } = await searchParams;
  const jobs = await getPublishedCareers();

  const preselected =
    jobId && title ? { id: jobId, title: decodeURIComponent(title) } : undefined;

  return (
    <>
      <PageHeader
        title={preselected ? `Apply — ${preselected.title}` : "Apply to Brookfield"}
        description="Tell us a bit about yourself. We review every application and reach out if there's a fit."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
          { label: "Apply" },
        ]}
      />

      <section className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        {!preselected && jobs.length === 0 ? (
          <p className="text-sm text-slate">
            There are no open positions listed right now. You&rsquo;re welcome to
            reach out via the{" "}
            <a href="/contact" className="text-brass hover:underline underline-offset-4">
              contact page
            </a>{" "}
            instead, and we&rsquo;ll keep your details on file.
          </p>
        ) : (
          <CareerApplicationForm
            careers={jobs.map((j) => ({ id: j.id, title: j.title }))}
            preselected={preselected}
          />
        )}
      </section>
    </>
  );
}
