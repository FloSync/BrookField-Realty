"use client";

import Link from "next/link";
import { navLinks, buildWhatsAppLink } from "@/lib/nav-links";
interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <div
      id="mobile-nav"
      className={`md:hidden border-t hairline bg-parchment overflow-hidden transition-[max-height] duration-300 ease-out ${
        open ? "max-h-[85vh]" : "max-h-0 border-t-0"
      }`}
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="flex flex-col divide-y divide-line">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="px-6 py-4 text-ink text-base hover:bg-parchment-dim"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-5 border-t hairline flex flex-col gap-3">
        <Link
          href="/properties"
          onClick={onClose}
          className="inline-flex w-full items-center justify-center bg-ink text-parchment px-6 py-3 text-sm font-medium"
        >
          View properties
        </Link>
        <a
          href={buildWhatsAppLink("Hello Brookfield, I would like some information.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="block w-full text-center bg-forest text-white py-3 text-sm font-medium"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
