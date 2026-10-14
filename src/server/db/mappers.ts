import type {
  Property,
  PropertyImage,
  Project,
  TeamMember,
  JobOpening,
} from "@/lib/types";

export interface PropertyRow {
  id: string;
  title: string;
  slug: string;
  property_type: string;
  category: string;
  location: string;
  state: string;
  address: string | null;
  price: number;
  currency: string;
  price_note: string | null;
  description: string;
  bedrooms: number | null;
  bathrooms: number | null;
  land_size: string | null;
  building_size: string | null;
  features: string;
  payment_plan: string | null;
  availability: string;
  featured: number;
  published: number;
  inspection_available: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyImageRow {
  id: string;
  property_id: string;
  url: string;
  alt: string;
  sort_order: number;
  is_primary: number;
}

export function mapProperty(
  row: PropertyRow,
  images: PropertyImageRow[]
): Property {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    propertyType: row.property_type,
    category: row.category as Property["category"],
    location: row.location,
    state: row.state,
    price: row.price,
    currency: row.currency as Property["currency"],
    priceNote: row.price_note ?? undefined,
    description: row.description,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    landSize: row.land_size ?? undefined,
    features: JSON.parse(row.features || "[]"),
    images: images
      .sort((a, b) => (b.is_primary - a.is_primary) || a.sort_order - b.sort_order)
      .map(mapPropertyImage),
    paymentPlan: row.payment_plan ?? undefined,
    availability: row.availability as Property["availability"],
    featured: !!row.featured,
    isInvestment: row.category === "investment",
    inspectionAvailable: !!row.inspection_available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPropertyImage(row: PropertyImageRow): PropertyImage {
  return { url: row.url, alt: row.alt };
}

export interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  status: string;
  image_url: string | null;
  units_info: string | null;
  published: number;
  created_at: string;
  updated_at: string;
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location,
    description: row.description,
    status: row.status as Project["status"],
    imageUrl: row.image_url ?? "",
    unitsInfo: row.units_info ?? undefined,
  };
}

export interface TeamMemberRow {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string | null;
  display_order: number;
  published: number;
  created_at: string;
  updated_at: string;
}

export function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    bio: row.bio,
    photoUrl: row.photo_url ?? "",
    group: "team",
  };
}

export interface CareerRow {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  application_instructions: string | null;
  application_contact: string | null;
  status: string;
  posted_at: string | null;
  closing_at: string | null;
  created_at: string;
  updated_at: string;
}

export function mapCareer(row: CareerRow): JobOpening {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.employment_type as JobOpening["type"],
    description: row.description,
    requirements: JSON.parse(row.requirements || "[]"),
  };
}
