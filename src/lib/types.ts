// Central data model for Brookfield Realty.
// Phase 1 uses in-memory mock data (see mock-data.ts). In Phase 2, the
// functions in mock-data.ts can be swapped for fetch calls against a
// Cloudflare D1-backed API without changing any component code, since
// components only ever import the types and accessor functions below.

export type PropertyCategory = "residential" | "commercial" | "land" | "investment";

export type PropertyAvailability = "available" | "reserved" | "sold";

export type PropertyListingType = "sale" | "rent";

/** Grouping on the /properties page (mirrors legacy site sections). */
export type PropertiesPageSection = "land-and-houses" | "commercial-for-sale";

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  propertyType: string; // e.g. "Detached Duplex", "Serviced Plot"
  category: PropertyCategory;
  location: string;
  state: string;
  price: number;
  currency: "NGN" | "USD";
  priceNote?: string; // e.g. "per plot", "starting from"
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  landSize?: string; // e.g. "600 sqm"
  features: string[];
  images: PropertyImage[];
  paymentPlan?: string;
  availability: PropertyAvailability;
  featured?: boolean;
  isInvestment?: boolean;
  inspectionAvailable?: boolean;
  listingType?: PropertyListingType;
  /** When set, overrides default /properties section placement. */
  propertiesPageSection?: PropertiesPageSection;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  legacyUrl: string;
}

export type TeamMemberGroup = "board" | "team";

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  group: TeamMemberGroup;
  /** True when photoUrl is a generic placeholder, not a confirmed staff portrait. */
  photoIsPlaceholder?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  photoUrl?: string;
  /** When true, shown with a demo label — not presented as a verified review. */
  isDemo?: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
  requirements: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  status: "Ongoing" | "Completed" | "Coming Soon";
  imageUrl: string;
  unitsInfo?: string;
}
