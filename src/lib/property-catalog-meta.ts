import type { Property } from "./types";

/** Slugs for legacy rental listings (not stored as a separate column in D1). */
export const RENT_LISTING_SLUGS = new Set([
  "5-bedrooms-detached-for-rent",
  "3-bedroom-semi-detached-for-rent",
  "3-bedroom-terrace-lekki-for-rent",
]);

/** Homepage “Latest properties” row — order preserved from marketing layout. */
export const HOME_LATEST_PROPERTY_SLUGS = [
  "beverly-homes",
  "free-zone-city",
  "coastal-villa",
  "paris-villa",
] as const;

export function applyPropertyCatalogMeta(property: Property): Property {
  const listingType = RENT_LISTING_SLUGS.has(property.slug) ? "rent" : property.listingType ?? "sale";
  return { ...property, listingType };
}

export function applyPropertyCatalogMetaList(properties: Property[]): Property[] {
  return properties.map(applyPropertyCatalogMeta);
}
