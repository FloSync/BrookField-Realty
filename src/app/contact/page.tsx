import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { BRAND, contactIntro, contactThankYou } from "@/lib/site-content";
import { sectionBackgrounds } from "@/lib/section-backgrounds";
import {
  WHATSAPP_LINK,
  PHONE_NUMBER,
  PHONE_NUMBER_TEL,
  EMAIL_ADDRESS,
} from "@/lib/nav-links";
import { OFFICE_ADDRESS, OFFICE_HOURS } from "@/lib/company";
import { getAllProperties } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: `Contact | ${BRAND.name}`,
};

export default function ContactPage() {
  const propertyOptions = getAllProperties().map((p) => ({
    slug: p.slug,
    title: p.title,
  }));

  return (
    <>
      <SectionBackdrop
        imageSrc={sectionBackgrounds.contact}
        imageAlt="Brookfield Realty contact"
        overlay={36}
        className="border-b-0"
        contentClassName="mx-auto max-w-6xl px-6 py-14 md:py-20"
      >
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-parchment/80">
          <Link href="/" className="hover:text-parchment">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-parchment">Contact</span>
        </nav>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-parchment max-w-3xl">
          Contact us
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/90 leading-relaxed text-base md:text-lg">
          {contactIntro}
        </p>
      </SectionBackdrop>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">Get in touch</h2>
          <p className="text-sm md:text-base text-slate leading-relaxed mb-8">{contactThankYou}</p>
          <ul className="space-y-5">
            <ContactItem icon={<Phone size={18} />} label="Phone">
              <a href={`tel:${PHONE_NUMBER_TEL}`} className="hover:text-brass">
                {PHONE_NUMBER}
              </a>
            </ContactItem>
            <ContactItem icon={<Mail size={18} />} label="Email">
              <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-brass">
                {EMAIL_ADDRESS}
              </a>
            </ContactItem>
            <ContactItem icon={<MapPin size={18} />} label="Visit us">
              {OFFICE_ADDRESS}
            </ContactItem>
            <ContactItem icon={<Clock size={18} />} label="Our hours">
              {OFFICE_HOURS}
            </ContactItem>
            <ContactItem icon={<MessageCircle size={18} />} label="WhatsApp">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brass hover:underline underline-offset-4"
              >
                Chat on WhatsApp
              </a>
            </ContactItem>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mb-6">Submit enquiry</h2>
          <EnquiryForm
            mode="general"
            showEnquiryTypePicker
            propertyOptions={propertyOptions}
            submitLabel="Submit enquiry"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <OfficeMap />
      </section>
    </>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-brass mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate uppercase tracking-wide">{label}</p>
        <p className="text-sm md:text-base text-ink mt-0.5">{children}</p>
      </div>
    </li>
  );
}
