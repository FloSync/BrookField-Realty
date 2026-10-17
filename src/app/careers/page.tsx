import type { Metadata } from "next";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { getPublishedCareers } from "@/server/db/queries/careers";

export const metadata: Metadata = {
  title: "Careers | Brookfield Realty & Investment Ltd.",
};

export const revalidate = 300;

export default async function CareersPage() {
  const jobs = await getPublishedCareers();

  return (
    <>
      <PageHeader
        title="Careers at Brookfield"
        description="Join a team focused on property advisory, documentation, and estate development. Openings below are demo listings for this preview."
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <div>
            <h2 className="font-serif text-2xl text-ink mb-3">Why work with Brookfield</h2>
          </div>
          <div className="md:col-span-2 text-slate leading-relaxed space-y-4">
            <p>
              Brookfield is structured around property advisory, legal
              documentation, and development delivery. Roles often include site
              visits and direct client contact.
            </p>
            <p>
              We are based in Lagos. Office address details will be confirmed
              before launch.
            </p>
          </div>
        </div>

        <h2 className="font-serif text-2xl text-ink mb-8">Current openings</h2>

        <div className="space-y-6">
          {jobs.map((job) => (
            <article key={job.id} className="border hairline bg-white p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-ink">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={13} /> {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {job.type}
                    </span>
                  </div>
                </div>
                <Button
                  href={`/careers/apply?jobId=${job.id}&title=${encodeURIComponent(job.title)}`}
                  variant="secondary"
                >
                  Apply
                </Button>
              </div>

              <p className="mt-5 text-sm text-slate leading-relaxed">{job.description}</p>

              <div className="mt-5 pt-5 border-t hairline">
                <p className="text-xs text-ink-soft mb-2">Requirements</p>
                <ul className="space-y-1.5">
                  {job.requirements.map((r) => (
                    <li key={r} className="text-sm text-slate flex gap-2">
                      <span className="text-brass">—</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 border hairline bg-parchment-dim p-8 text-center">
          <h3 className="font-serif text-xl text-ink">Don&apos;t see a fit today?</h3>
          <p className="mt-2 text-sm text-slate max-w-md mx-auto">
            Send your CV and a short note. Applications can be connected to HR
            systems in a later phase.
          </p>
          <div className="mt-5">
            <Button href="/careers/apply">Send your CV</Button>
          </div>
        </div>
      </section>
    </>
  );
}
