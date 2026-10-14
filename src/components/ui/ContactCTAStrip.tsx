import { Phone, Mail, MessageCircle } from "lucide-react";
import {
  PHONE_NUMBER,
  PHONE_NUMBER_TEL,
  EMAIL_ADDRESS,
  buildWhatsAppLink,
} from "@/lib/nav-links";

export function ContactCTAStrip({
  whatsappMessage,
  className = "",
}: {
  whatsappMessage?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-6 gap-y-3 text-sm ${className}`}
    >
      <a
        href={`tel:${PHONE_NUMBER_TEL}`}
        className="inline-flex items-center gap-2 text-ink-soft hover:text-brass"
      >
        <Phone size={15} /> {PHONE_NUMBER}
      </a>
      <a
        href={`mailto:${EMAIL_ADDRESS}`}
        className="inline-flex items-center gap-2 text-ink-soft hover:text-brass"
      >
        <Mail size={15} /> {EMAIL_ADDRESS}
      </a>
      <a
        href={buildWhatsAppLink(whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-forest hover:underline underline-offset-4"
      >
        <MessageCircle size={15} /> Chat on WhatsApp
      </a>
    </div>
  );
}
