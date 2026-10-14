"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HERO_IMAGE_QUALITY } from "@/lib/property-image";
import { HOME_HERO_ROTATE_MS, homeHeroSlides } from "@/lib/home-hero-slides";

interface HomeHeroProps {
  tagline: string;
  headline: string;
  intro: string;
  conglomerateLine: string;
}

export function HomeHero({
  tagline,
  headline,
  intro,
  conglomerateLine,
}: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);

    const onScroll = () => {
      if (mq.matches || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top, 0), rect.height);
      setOffsetY(progress * 0.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || homeHeroSlides.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % homeHeroSlides.length);
    }, HOME_HERO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b hairline min-h-[620px] sm:min-h-[720px] md:min-h-[820px] lg:min-h-[880px] flex items-center"
    >
      <div className="absolute inset-0 hero-parallax-bg">
        {homeHeroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              index === activeSlide ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index <= 1}
              unoptimized={slide.unoptimized}
              quality={HERO_IMAGE_QUALITY}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        ))}
        <div
          className="absolute inset-0 z-[1] bg-gradient-to-r from-ink/78 via-ink/50 to-ink/20"
          aria-hidden
        />
      </div>

      <div
        className="relative z-[2] mx-auto max-w-7xl px-6 sm:px-8 py-24 md:py-32 lg:py-36 w-full will-change-transform motion-reduce:transform-none"
        style={reduceMotion ? undefined : { transform: `translate3d(0, ${offsetY}px, 0)` }}
      >
        <p className="text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase text-brass-light mb-5 md:mb-6 font-semibold drop-shadow-sm">
          {tagline}
        </p>
        <h1 className="font-serif text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] font-bold text-parchment max-w-5xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
          {headline}
        </h1>
        <p className="mt-7 md:mt-8 text-lg sm:text-xl md:text-2xl text-parchment font-medium leading-relaxed max-w-3xl drop-shadow-md">
          {intro}
        </p>
        <p className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl text-parchment/90 leading-relaxed max-w-3xl font-semibold drop-shadow-sm">
          {conglomerateLine}
        </p>
        <div className="mt-10 md:mt-12 flex flex-wrap gap-4">
          <Button
            href="/properties"
            className="!px-8 !py-4 md:!px-10 md:!py-[1.125rem] !text-base md:!text-lg !font-semibold shadow-lg"
          >
            Explore properties
          </Button>
          <Button
            href="/contact"
            variant="secondary"
            className="!px-8 !py-4 md:!px-10 md:!py-[1.125rem] !text-base md:!text-lg !font-semibold !border-2 !border-parchment/50 !text-parchment hover:!bg-parchment hover:!text-ink shadow-lg"
          >
            Contact us
          </Button>
        </div>
      </div>

      {!reduceMotion && homeHeroSlides.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 gap-2.5"
          aria-label="Hero image slideshow"
        >
          {homeHeroSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show hero image ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "w-10 bg-parchment"
                  : "w-2.5 bg-parchment/45 hover:bg-parchment/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
