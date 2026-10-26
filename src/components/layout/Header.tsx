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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 md:py-3.5 flex items-center justify-between gap-3 md:gap-4">
        <Link href="/" className="flex items-center gap-2.5 md:gap-3 shrink-0 min-w-0 max-w-[min(52vw,14rem)] sm:max-w-[min(44vw,16rem)] md:max-w-none">
          <Image
            src="/logo.png"
            alt={BRAND.name}
            width={280}
            height={80}
            className="h-12 sm:h-[3.25rem] md:h-[3.75rem] lg:h-16 w-auto max-w-full object-contain object-left contrast-[1.14] saturate-[1.08] drop-shadow-[0_1px_1px_rgba(20,8,31,0.12)]"
            priority
          />
          <span className="hidden xl:block text-xs tracking-wide text-slate leading-tight border-l pl-4 hairline shrink-0">
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
