import type { Property } from "./types";

/** Legacy brookfieldrealtorltd.com/properties → “Commercials / For Sale”. */
export const COMMERCIAL_FOR_SALE_SLUGS = [
  "luxury-3-bedroom-apartment",
  "4-bedroom-semi-detached-beachwood",
  "3-bedroom-terrace-duplex-chevron",
  "luxury-3-bedroom-terrace-duplex-chevron",
  "beverly-homes",
  "6-units-3-bedroom-flats",
] as const;

const commercialSlugSet = new Set<string>(COMMERCIAL_FOR_SALE_SLUGS);

export function isCommercialForSaleListing(property: Property): boolean {
  return (
    property.listingType === "sale" &&
    (property.propertiesPageSection === "commercial-for-sale" ||
      commercialSlugSet.has(property.slug))
  );
}

export function isLandAndHousesForSaleListing(property: Property): boolean {
  return property.listingType === "sale" && !isCommercialForSaleListing(property);
}

export function getLandAndHousesForSale(properties: Property[]): Property[] {
  return properties.filter(isLandAndHousesForSaleListing);
}

export function getCommercialForSale(properties: Property[]): Property[] {
  return properties.filter(isCommercialForSaleListing);
}

export function isFlyerImageUrl(url: string): boolean {
  return url.includes("flyer-cover");
}

/** Wide marketing renders (not portrait PDF flyers). */
export function isLandscapeFlyerUrl(url: string): boolean {
  return url.includes("/beverly-homes/");
}
