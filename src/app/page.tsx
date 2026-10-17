import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/ui/CTASection";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { HomeHero } from "@/components/home/HomeHero";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { getLatestHomeProperties } from "@/server/db/queries/properties";
import { getPublishedTeam } from "@/server/db/queries/team";
import { splitPublishedTeam } from "@/lib/team-groups";
import { SECTION_BACKDROP_IMAGE_QUALITY } from "@/lib/property-image";
import { getBlogPosts } from "@/lib/blog-data";
import {
  BRAND,
  heroHeadline,
  companyIntro,
  homeConglomerateLine,
  homeCoreValues,
  aboutSummary,
  services,
  servicesIntro,
  servicesConsultation,
  contactThankYou,
  homeLetsHelpYou,
} from "@/lib/site-content";
import { sectionBackgrounds } from "@/lib/section-backgrounds";

export const revalidate = 300;

export default async function HomePage() {
  const latestProperties = await getLatestHomeProperties();
  const { board: boardPreview, staff: teamStaff } = splitPublishedTeam(
    await getPublishedTeam()
  );
  const teamPreview = teamStaff.slice(0, 4);
  const blogPosts = getBlogPosts().slice(0, 2);
  const topServices = services.slice(0, 3);

  return (
    <>
      <HomeHero
        tagline={BRAND.tagline}
        headline={heroHeadline}
        intro={companyIntro}
        conglomerateLine={homeConglomerateLine}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink">
              {homeConglomerateLine}
            </h2>
          </div>
          <p className="text-base md:text-lg text-slate leading-relaxed">{homeCoreValues}</p>
        </div>
        <p className="mt-8 text-base md:text-lg text-slate leading-relaxed max-w-4xl">
          {aboutSummary}
        </p>
      </section>

      <SectionBackdrop
        imageSrc={sectionBackgrounds.homeAccent}
        imageAlt="Brookfield Realty services"
        overlay={38}
      >
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold">Our Services</h2>
          <Link
            href="/services"
            className="text-sm text-brass-light hover:text-parchment inline-flex items-center gap-1"
          >
            All services <ArrowUpRight size={14} />
          </Link>
        </div>
        <p className="text-parchment/90 leading-relaxed max-w-3xl mb-10 text-base md:text-lg">
          {servicesIntro}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {topServices.map((s) => (
            <div key={s.id} className="border border-parchment/20 bg-ink/40 backdrop-blur-sm p-6">
              <h3 className="font-serif text-xl text-parchment">{s.title}</h3>
              <p className="mt-3 text-sm text-parchment/85 leading-relaxed">{s.description}</p>
              <Link href={s.href} className="mt-4 inline-block text-sm text-brass-light hover:underline">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </SectionBackdrop>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink">
              Latest properties
            </h2>
            <p className="mt-1.5 text-sm text-slate">Investment opportunities</p>
          </div>
          <Link
            href="/properties"
            className="text-sm text-brass hover:underline underline-offset-4 hidden sm:inline-flex items-center gap-1"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <PropertyGrid properties={latestProperties} />
      </section>

      <SectionBackdrop
        imageSrc={sectionBackgrounds.properties}
        imageAlt=""
        overlay={40}
        contentClassName="min-h-[220px] md:min-h-[280px]"
      >
        <span className="sr-only">Brookfield property listings</span>
      </SectionBackdrop>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink">About {BRAND.name}</h2>
          <p className="mt-4 text-base md:text-lg text-slate leading-relaxed">{servicesConsultation}</p>
          <div className="mt-6">
            <Button href="/about" variant="secondary">
              About us
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] border hairline overflow-hidden">
          <Image
            src={sectionBackgrounds.homeAccentAlt}
            alt="Brookfield Realty — Free Zone City overview"
            fill
            quality={SECTION_BACKDROP_IMAGE_QUALITY}
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink">Our team</h2>
          <Link
            href="/team"
            className="text-sm text-brass hover:underline underline-offset-4 hidden sm:inline-flex items-center gap-1"
          >
            Meet the team <ArrowUpRight size={14} />
          </Link>
        </div>
        <h3 className="font-serif text-2xl text-ink mb-6">The Board</h3>
        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mb-12">
          {boardPreview.map((member) => (
            <TeamMemberCard key={member.id} member={member} size="board" />
          ))}
        </div>
        <h3 className="font-serif text-2xl text-ink mb-6">The Team</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamPreview.map((member) => (
            <TeamMemberCard key={member.id} member={member} size="team" />
          ))}
        </div>
      </section>

      <section className="bg-parchment-dim border-y hairline">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink">Blog</h2>
            <Link
              href="/blog"
              className="text-sm text-brass hover:underline underline-offset-4 hidden sm:inline-flex items-center gap-1"
            >
              View blog <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Let's help you"
        description={`${homeLetsHelpYou} ${contactThankYou}`}
        primaryLabel="Explore properties"
        primaryHref="/properties"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />
    </>
  );
}
