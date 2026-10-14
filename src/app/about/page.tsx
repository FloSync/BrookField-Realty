import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CTASection } from "@/components/ui/CTASection";
import {
  BRAND,
  aboutSummary,
  aboutMission,
  aboutDifferentiator,
  professionalProfile,
  clientRelationship,
  aboutVision,
  aboutMissionStatement,
  legacyStats,
  teamIntro,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: `About Us | ${BRAND.name}`,
  description: aboutSummary,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title={`About ${BRAND.name}`}
        description={BRAND.tagline}
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-ink mb-5 tracking-tight">
            Who We Are
          </h2>
          <p className="text-sm tracking-[0.15em] uppercase text-brass font-semibold mb-4">
            Redefining luxury living
          </p>
          <p className="text-slate leading-relaxed">{aboutSummary}</p>
          <p className="mt-4 text-slate leading-relaxed">{aboutMission}</p>
          <p className="mt-4 text-slate leading-relaxed">{aboutDifferentiator}</p>
        </div>
        <div className="relative aspect-[4/5] border hairline overflow-hidden">
          <Image src="/homepage-hero.png" alt="Brookfield Realty" fill className="object-cover" sizes="40vw" />
        </div>
      </section>

      <section className="bg-parchment-dim border-y hairline">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="font-serif text-2xl text-ink mb-4">Professional profile</h2>
          <p className="text-slate leading-relaxed max-w-3xl">{professionalProfile}</p>
          <p className="mt-4 text-slate leading-relaxed max-w-3xl">{clientRelationship}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10">
        <div className="border border-parchment/15 bg-ink p-8 md:p-10">
          <h3 className="font-serif text-2xl text-parchment mb-3">Our vision</h3>
          <p className="text-parchment/85 leading-relaxed">{aboutVision}</p>
        </div>
        <div className="border border-parchment/15 bg-ink p-8 md:p-10">
          <h3 className="font-serif text-2xl text-parchment mb-3">Our mission</h3>
          <p className="text-parchment/85 leading-relaxed">{aboutMissionStatement}</p>
        </div>
      </section>

      <section className="bg-parchment-dim border-y hairline">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="font-serif text-2xl text-ink mb-4">Our team</h2>
          <p className="text-slate leading-relaxed max-w-3xl">{teamIntro}</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {legacyStats.map((s) => (
              <div key={s.label} className="border hairline bg-white p-6 text-center">
                <p className="font-serif text-3xl text-ink">{s.value}</p>
                <p className="mt-1 text-xs text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Meet the people behind Brookfield Realty"
        primaryLabel="Our team"
        primaryHref="/team"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />
    </>
  );
}
