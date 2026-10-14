import type { Metadata } from "next";
import Link from "next/link";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { CTASection } from "@/components/ui/CTASection";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { getTeamBoard, getTeamStaff } from "@/lib/mock-data";
import { BRAND, teamIntro } from "@/lib/site-content";
import { sectionBackgrounds } from "@/lib/section-backgrounds";

export const metadata: Metadata = {
  title: `Our Team | ${BRAND.name}`,
};

export default function TeamPage() {
  const board = getTeamBoard();
  const staff = getTeamStaff();

  return (
    <>
      <SectionBackdrop
        imageSrc={sectionBackgrounds.ourTeamHero}
        imageAlt="Brookfield Realty team"
        overlay={55}
        overlayColor="#14081F"
        contentClassName="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:py-[300px] lg:pb-14"
      >
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-parchment/80">
          <Link href="/" className="hover:text-parchment">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-parchment">Our Team</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment">
          Our team
        </h1>
        <p className="mt-4 max-w-3xl text-parchment/90 leading-relaxed text-base md:text-lg">
          {teamIntro}
        </p>
      </SectionBackdrop>

      <div className="bg-[#F6F3F5]">
      <section className="mx-auto max-w-6xl px-6 pt-16 md:pt-20 pb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-10">The Board</h2>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-xl md:max-w-2xl mx-auto">
          {board.map((member) => (
            <TeamMemberCard key={member.id} member={member} size="board" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-10">The Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {staff.map((member) => (
            <TeamMemberCard key={member.id} member={member} size="team" />
          ))}
        </div>
      </section>
      </div>

      <CTASection
        title="Looking to join Brookfield?"
        description="See open roles or send your CV for future consideration."
        primaryLabel="View careers"
        primaryHref="/careers"
      />
    </>
  );
}
