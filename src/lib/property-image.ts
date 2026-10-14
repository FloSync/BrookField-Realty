/** Shared tuning for Brookfield listing photos (cards, galleries). Homepage hero unchanged. */
export const PROPERTY_IMAGE_QUALITY = 90;

/** Full-viewport hero slides — max allowed quality in next.config. */
export const HERO_IMAGE_QUALITY = 90;

/** Full-bleed section backgrounds — slightly lower to limit duplicate recompression. */
export const SECTION_BACKDROP_IMAGE_QUALITY = 85;

export const BLOG_CARD_IMAGE_QUALITY = 85;

export const propertyImageClassName =
  "object-cover object-center [image-rendering:auto]";

export const propertyImageHoverClassName =
  "transition-transform duration-300 group-hover:scale-[1.03]";

export const propertyImageFrameClassName = "relative overflow-hidden bg-[#e4e8ef]";

export const propertyFlyerFrameClassName =
  "relative overflow-hidden bg-[#f4f6f8]";

export const propertyFlyerImageClassName =
  "object-contain object-center p-2 sm:p-3 [image-rendering:auto]";

export const propertyLandscapeFlyerImageClassName =
  "object-contain object-center p-0 [image-rendering:auto]";
