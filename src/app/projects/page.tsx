import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CTASection } from "@/components/ui/CTASection";
import { ContactCTAStrip } from "@/components/ui/ContactCTAStrip";
import { getPublishedProjects } from "@/server/db/queries/projects";

export const metadata: Metadata = {
  title: "Projects & Estates | Brookfield Realty & Investment Ltd.",
};

export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <PageHeader
        title="Projects & estates"
        description="Estate developments and mixed-use projects — ongoing, completed, and coming soon."
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />

      <div className="border-b hairline bg-parchment-dim">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <ContactCTAStrip whatsappMessage="Hello Brookfield, I would like to learn more about your projects and estates." />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 gap-8">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <CTASection
        title="Interested in a plot within one of our estates?"
        description="Browse individual listings or contact us about allocation within an ongoing project."
        primaryLabel="View properties"
        primaryHref="/properties"
      />
    </>
  );
}
