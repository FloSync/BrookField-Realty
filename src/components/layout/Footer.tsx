import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";
import {
  footerNavLinks,
  PHONE_NUMBER,
  PHONE_NUMBER_TEL,
  EMAIL_ADDRESS,
  buildWhatsAppLink,
  OFFICE_ADDRESS,
  BRAND,
} from "@/lib/nav-links";
import { companyIntro, socialLinks, services } from "@/lib/site-content";
import { OFFICE_HOURS } from "@/lib/company";

export function Footer() {
  return (
    <footer className="bg-ink text-parchment/80 mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Image src="/logo.png" alt={BRAND.name} width={130} height={36} className="h-8 w-auto brightness-0 invert" />
          <p className="mt-2 text-[11px] text-brass-light">{BRAND.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-parchment/60 max-w-xs">{companyIntro}</p>
        </div>

        <div>
          <h3 className="text-xs tracking-wide text-brass-light mb-4">Company</h3>
          <ul className="space-y-2.5 text-sm">
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-parchment">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs tracking-wide text-brass-light mb-4">Services</h3>
          <ul className="space-y-2.5 text-sm text-parchment/70">
            {services.slice(0, 5).map((s) => (
              <li key={s.id}>
                <Link href="/services" className="hover:text-parchment">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs tracking-wide text-brass-light mb-4">Contact</h3>
          <ul className="space-y-2.5 text-sm text-parchment/70">
            <li>
              <a href={`tel:${PHONE_NUMBER_TEL}`} className="hover:text-parchment">
                {PHONE_NUMBER}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL_ADDRESS}`} className="hover:text-parchment">
                {EMAIL_ADDRESS}
              </a>
            </li>
            <li>{OFFICE_ADDRESS}</li>
            <li>{OFFICE_HOURS}</li>
            <li>
              <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="hover:text-parchment">
                WhatsApp
              </a>
            </li>
          </ul>
          <ul className="flex flex-wrap gap-3 mt-6 text-sm text-parchment/70">
            <li>
              <a href={socialLinks.facebook} className="hover:text-parchment inline-flex items-center gap-1">
                <Share2 size={14} /> Facebook
              </a>
            </li>
            <li>
              <a href={socialLinks.instagram} className="hover:text-parchment inline-flex items-center gap-1">
                <Share2 size={14} /> Instagram
              </a>
            </li>
            <li>
              <a href={socialLinks.linkedin} className="hover:text-parchment inline-flex items-center gap-1">
                <Share2 size={14} /> LinkedIn
              </a>
            </li>
            <li>
              <a href={socialLinks.twitter} className="hover:text-parchment inline-flex items-center gap-1">
                <Share2 size={14} /> Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-parchment/10">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-parchment/50 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <span>{BRAND.legalName}</span>
        </div>
      </div>
    </footer>
  );
}
