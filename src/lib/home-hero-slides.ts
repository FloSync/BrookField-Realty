/** Homepage hero rotation — existing hero plus user-supplied city & living-room slides. */
export const homeHeroSlides = [
  {
    src: "/homepage-hero.png",
    alt: "",
    objectPosition: "center",
    unoptimized: false,
  },
  {
    src: "/hero/hero-slide-city.png",
    alt: "",
    objectPosition: "center",
    /** Full-resolution asset — skip optimizer to keep the skyline sharp */
    unoptimized: true,
  },
  {
    src: "/hero/hero-slide-living-room.png",
    alt: "",
    objectPosition: "center 35%",
    unoptimized: false,
  },
] as const;

export const HOME_HERO_ROTATE_MS = 7000;
