export interface AdminPropertyInput {
  title: string;
  slug: string;
  propertyType: string;
  category: "residential" | "commercial" | "land" | "investment";
  location: string;
  state: string;
  address?: string;
  price: number;
  currency: "NGN" | "USD";
  priceNote?: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  landSize?: string;
  buildingSize?: string;
  features: string[];
  paymentPlan?: string;
  availability: "available" | "reserved" | "sold";
  featured: boolean;
  published: boolean;
  inspectionAvailable: boolean;
}

export interface AdminProperty extends AdminPropertyInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  images: AdminPropertyImage[];
}

export interface AdminPropertyImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface AdminProjectInput {
  name: string;
  slug: string;
  location: string;
  description: string;
  status: "Ongoing" | "Completed" | "Coming Soon";
  imageUrl?: string;
  unitsInfo?: string;
  published: boolean;
}

export interface AdminProject extends AdminProjectInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTeamMemberInput {
  name: string;
  position: string;
  bio: string;
  photoUrl?: string;
  displayOrder: number;
  published: boolean;
}

export interface AdminTeamMember extends AdminTeamMemberInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCareerInput {
  title: string;
  department: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract";
  description: string;
  requirements: string[];
  applicationInstructions?: string;
  applicationContact?: string;
  status: "draft" | "published" | "closed" | "archived";
  postedAt?: string;
  closingAt?: string;
}

export interface AdminCareer extends AdminCareerInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
