import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import {
  PROPERTY_IMAGE_QUALITY,
  propertyFlyerFrameClassName,
  propertyFlyerImageClassName,
  propertyLandscapeFlyerImageClassName,
  propertyImageClassName,
  propertyImageFrameClassName,
  propertyImageHoverClassName,
} from "@/lib/property-image";
import { isFlyerImageUrl, isLandscapeFlyerUrl } from "@/lib/properties-page";
import { formatPrice, availabilityLabel } from "@/lib/utils";

const availabilityStyles: Record<Property["availability"], string> = {
  available: "bg-forest/10 text-forest",
  reserved: "bg-brass/15 text-brass",
  sold: "bg-slate/15 text-slate",
};

export function PropertyCard({
  property,
  prominent = false,
}: {
  property: Property;
  /** Larger flyer + title on the /properties page. */
  prominent?: boolean;
}) {
  const cover = property.images[0];
  const isFlyerCover = cover ? isFlyerImageUrl(cover.url) : false;
  const isLandscapeFlyer = cover ? isLandscapeFlyerUrl(cover.url) : false;
  const landscapeImageFrame = prominent
    ? "relative h-[460px] sm:h-[520px] w-full max-w-full shrink-0"
    : "relative h-[380px] sm:h-[450px] md:h-[500px] w-full max-w-full shrink-0";

  const imageAspect = isLandscapeFlyer
    ? landscapeImageFrame
    : isFlyerCover
      ? prominent
        ? "aspect-[3/4] min-h-[280px] sm:min-h-[320px]"
        : "aspect-[3/4]"
      : prominent
        ? "aspect-[4/3] min-h-[220px]"
        : "aspect-[4/3]";

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden border hairline bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className={`${
          isLandscapeFlyer
            ? `${landscapeImageFrame} ${propertyFlyerFrameClassName}`
            : `${imageAspect} w-full max-w-full shrink-0 ${
                isFlyerCover ? propertyFlyerFrameClassName : propertyImageFrameClassName
              }`
        }`}
      >
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            quality={PROPERTY_IMAGE_QUALITY}
            sizes={
              prominent
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            }
            className={
              isLandscapeFlyer
                ? propertyLandscapeFlyerImageClassName
                : isFlyerCover
                  ? propertyFlyerImageClassName
                  : `${propertyImageClassName} ${propertyImageHoverClassName}`
            }
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate px-4 text-center">
            Brookfield Realty listing
          </div>
        )}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-medium ${availabilityStyles[property.availability]}`}
        >
          {availabilityLabel(property.availability)}
        </span>
        {property.listingType === "rent" && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-medium bg-ink text-parchment">
            For rent
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${prominent ? "p-6 md:p-7" : "p-5"}`}>
        <p className="text-xs text-brass font-medium mb-1.5 uppercase tracking-wide">
          {property.propertyType}
        </p>
        <h3
          className={
            prominent
              ? "font-serif text-2xl sm:text-[1.65rem] font-bold text-ink leading-tight tracking-tight"
              : "font-serif text-lg text-ink leading-snug font-semibold"
          }
        >
          {property.title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-slate">
          <MapPin size={15} className="shrink-0 mt-0.5" />
          <span>
            {property.location}, {property.state}
          </span>
        </p>
        {property.landSize && (
          <p className="mt-1.5 text-sm font-medium text-ink/80">{property.landSize}</p>
        )}
        <p
          className={`mt-3 text-sm text-slate ${prominent ? "line-clamp-3" : "line-clamp-2"}`}
        >
          {property.description}
        </p>
        <div className="mt-5 flex items-end justify-between border-t hairline pt-4 gap-4">
          <div className="min-w-0">
            <p
              className={
                prominent
                  ? "text-lg font-semibold text-ink"
                  : "text-base font-medium text-ink"
              }
            >
              {formatPrice(property.price, property.currency)}
            </p>
            {property.priceNote && (
              <p className="text-xs text-slate mt-0.5 line-clamp-2">{property.priceNote}</p>
            )}
          </div>
          <span className="text-sm font-medium text-brass group-hover:underline underline-offset-4 shrink-0">
            View property
          </span>
        </div>
      </div>
    </Link>
  );
}
