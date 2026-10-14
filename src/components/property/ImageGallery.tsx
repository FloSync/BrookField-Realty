"use client";

import { useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "@/lib/types";
import {
  PROPERTY_IMAGE_QUALITY,
  propertyFlyerFrameClassName,
  propertyFlyerImageClassName,
  propertyLandscapeFlyerImageClassName,
  propertyImageClassName,
  propertyImageFrameClassName,
} from "@/lib/property-image";
import { isFlyerImageUrl, isLandscapeFlyerUrl } from "@/lib/properties-page";

export function ImageGallery({ images }: { images: PropertyImage[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-parchment-dim border hairline flex items-center justify-center text-slate text-sm">
        No images available
      </div>
    );
  }

  const current = images[active];
  const isFlyer = isFlyerImageUrl(current.url);
  const isLandscapeFlyer = isLandscapeFlyerUrl(current.url);

  return (
    <div>
      <div
        className={`${
          isLandscapeFlyer
            ? "relative h-[480px] sm:h-[560px] md:h-[640px] w-full max-w-full"
            : isFlyer
              ? "aspect-[3/4] max-h-[720px]"
              : "aspect-[16/10]"
        } border hairline ${
          isFlyer ? propertyFlyerFrameClassName : propertyImageFrameClassName
        }`}
      >
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority={active === 0}
          quality={PROPERTY_IMAGE_QUALITY}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={
            isLandscapeFlyer
              ? propertyLandscapeFlyerImageClassName
              : isFlyer
                ? propertyFlyerImageClassName
                : propertyImageClassName
          }
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, i) => {
            const thumbFlyer = isFlyerImageUrl(img.url);
            return (
              <button
                key={img.url + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={`aspect-square border ${
                  thumbFlyer ? propertyFlyerFrameClassName : propertyImageFrameClassName
                } ${i === active ? "border-brass" : "hairline"}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  quality={PROPERTY_IMAGE_QUALITY}
                  sizes="160px"
                  className={
                    thumbFlyer ? propertyFlyerImageClassName : propertyImageClassName
                  }
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
