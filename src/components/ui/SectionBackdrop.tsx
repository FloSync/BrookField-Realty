import Image from "next/image";
import type { ReactNode } from "react";
import { SECTION_BACKDROP_IMAGE_QUALITY } from "@/lib/property-image";

interface SectionBackdropProps {
  imageSrc: string;
  imageAlt?: string;
  children: ReactNode;
  /** 0–100 — lighter overlay keeps photos bright like the legacy site */
  overlay?: number;
  /** Legacy pages often use #14081F instead of brand ink */
  overlayColor?: string;
  className?: string;
  contentClassName?: string;
}

export function SectionBackdrop({
  imageSrc,
  imageAlt,
  children,
  overlay = 36,
  overlayColor,
  className = "",
  contentClassName = "mx-auto max-w-6xl px-6 py-16 md:py-20",
}: SectionBackdropProps) {
  return (
    <section className={`relative overflow-hidden border-y hairline ${className}`}>
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt ?? ""}
          fill
          sizes="100vw"
          quality={SECTION_BACKDROP_IMAGE_QUALITY}
          className="object-cover object-center"
          aria-hidden={!imageAlt}
        />
        <div
          className={overlayColor ? "absolute inset-0" : "absolute inset-0 bg-ink"}
          style={{
            opacity: overlay / 100,
            ...(overlayColor ? { backgroundColor: overlayColor } : {}),
          }}
          aria-hidden
        />
      </div>
      <div className={`relative text-parchment ${contentClassName}`}>{children}</div>
    </section>
  );
}
