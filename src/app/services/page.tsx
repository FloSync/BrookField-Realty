import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CTASection } from "@/components/ui/CTASection";
import { services, servicesIntro } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Services | Brookfield Realty",
  description: servicesIntro.slice(0, 155),
};

export default function ServicesPage() {
  return (
    <>
      <div className="relative overflow-hidden bg-parchment-dim">
        <div
          className="pointer-events-none absolute inset-x-0 top-[5.5rem] md:top-[6.25rem] flex justify-end max-w-6xl mx-auto px-6 overflow-hidden"
          aria-hidden
        >
          <Image
            src="/logo.png"
            alt=""
            width={720}
            height={210}
            className="w-[min(72vw,520px)] md:w-[min(55vw,480px)] h-auto select-none -mr-2 md:mr-0 mix-blend-multiply opacity-[0.34] md:opacity-[0.38] border-0 outline-none ring-0 [clip-path:inset(0_6%_30%_6%)]"
          />
        </div>
        <PageHeader
          title="Our services"
          description={servicesIntro}
          crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
          className="relative z-10 border-0 bg-transparent"
        />
      </div>
      <div className="relative overflow-hidden bg-parchment-dim">
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} translucent />
            ))}
          </div>
        </section>
        <div className="relative z-10">
          <CTASection
            title="Request a free consultation"
            description="Our consultants are ready to answer your questions and provide real-time solutions."
            primaryLabel="Contact us"
            primaryHref="/contact"
          />
        </div>
      </div>
    </>
  );
}
