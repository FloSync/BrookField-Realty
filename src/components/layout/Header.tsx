"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks, BRAND } from "@/lib/nav-links";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur border-b hairline">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-3.5 md:py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 md:gap-4 shrink-0 min-w-0">
          <Image
            src="/logo.png"
            alt={BRAND.name}
            width={220}
            height={64}
            className="h-11 sm:h-12 md:h-14 w-auto object-contain"
            priority
          />
          <span className="hidden lg:block text-xs tracking-wide text-slate leading-tight border-l pl-4 hairline">
            {BRAND.tagline}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:flex items-center gap-4">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm md:text-base font-medium text-ink-soft hover:text-brass transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block shrink-0">
          <Button href="/properties" className="!py-3 !px-6 !text-base !font-semibold">
            Explore properties
          </Button>
        </div>

        <button
          type="button"
          className="xl:hidden p-2 -mr-2 text-ink"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
