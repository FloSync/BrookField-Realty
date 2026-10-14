import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_NUMBER,
  OFFICE_ADDRESS,
} from "./company";
import { BRAND } from "./site-content";

export { BRAND };

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Properties", href: "/properties" },
  { label: "Our Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNavLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Properties", href: "/properties" },
  { label: "Our Team", href: "/team" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
  { label: "Careers", href: "/careers" },
];

export const EMAIL_ADDRESS = EMAIL;
export const PHONE_NUMBER = PHONE_DISPLAY;
export const PHONE_NUMBER_TEL = PHONE_TEL;
export { OFFICE_ADDRESS };

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export function buildWhatsAppLink(message?: string): string {
  if (!message) return WHATSAPP_LINK;
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyWhatsAppLink(propertyTitle: string): string {
  return buildWhatsAppLink(
    `Hello ${BRAND.name}, I am interested in ${propertyTitle}. Please can I get more information?`
  );
}
