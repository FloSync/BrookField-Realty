import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const propertySchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase letters, numbers and hyphens only."),
  propertyType: z.string().trim().min(2, "Property type is required."),
  category: z.enum(["residential", "commercial", "land", "investment"]),
  location: z.string().trim().min(2, "Location is required."),
  state: z.string().trim().min(2, "State is required."),
  address: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().int().positive("Price must be a positive number."),
  currency: z.enum(["NGN", "USD"]),
  priceNote: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().min(10, "Add a short description."),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  landSize: z.string().trim().optional().or(z.literal("")),
  buildingSize: z.string().trim().optional().or(z.literal("")),
  features: z.string().trim().optional().or(z.literal("")), // newline-separated in the form
  paymentPlan: z.string().trim().optional().or(z.literal("")),
  availability: z.enum(["available", "reserved", "sold"]),
  featured: z.boolean(),
  published: z.boolean(),
  inspectionAvailable: z.boolean(),
});

export const projectSchema = z.object({
  name: z.string().trim().min(3, "Name is required."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(slugPattern, "Slug must be lowercase letters, numbers and hyphens only."),
  location: z.string().trim().min(2, "Location is required."),
  description: z.string().trim().min(10, "Add a short description."),
  status: z.enum(["Ongoing", "Completed", "Coming Soon"]),
  imageUrl: z.string().trim().url("Enter a valid image URL.").optional().or(z.literal("")),
  unitsInfo: z.string().trim().optional().or(z.literal("")),
  published: z.boolean(),
});

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  position: z.string().trim().min(2, "Position is required."),
  bio: z.string().trim().min(10, "Add a short biography."),
  photoUrl: z.string().trim().url("Enter a valid photo URL.").optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().min(0),
  published: z.boolean(),
});

export const careerSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  department: z.string().trim().min(2, "Department is required."),
  location: z.string().trim().min(2, "Location is required."),
  employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
  description: z.string().trim().min(10, "Add a short description."),
  requirements: z.string().trim().optional().or(z.literal("")), // newline-separated
  applicationInstructions: z.string().trim().optional().or(z.literal("")),
  applicationContact: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "closed", "archived"]),
});

export function linesToList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// --- Phase 3: public-facing forms --------------------------------------

const phonePattern = /^[+\d][\d\s-]{6,19}$/;

export const enquirySchema = z
  .object({
    enquiryType: z.enum(["general", "property", "inspection", "investment"]),
    name: z.string().trim().min(2, "Enter your full name.").max(120),
    phone: z
      .string()
      .trim()
      .regex(phonePattern, "Enter a valid phone number."),
    email: z.string().trim().email("Enter a valid email address."),
    message: z
      .string()
      .trim()
      .max(2000, "Message is too long (2000 characters max).")
      .optional()
      .or(z.literal("")),
    propertySlug: z.string().trim().optional().or(z.literal("")),
    preferredInspectionDate: z.string().trim().optional().or(z.literal("")),
    preferredInspectionTime: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.enquiryType !== "inspection") {
      if (!data.message || data.message.length < 10) {
        ctx.addIssue({
          code: "custom",
          path: ["message"],
          message: "Say a little more so we know how to help (at least 10 characters).",
        });
      }
    }
  });

export const careerApplicationSchema = z.object({
  careerId: z.string().trim().optional().or(z.literal("")),
  jobTitle: z.string().trim().min(2, "Select the position you're applying for."),
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Enter a valid phone number."),
  coverMessage: z
    .string()
    .trim()
    .min(20, "Tell us a bit about why you're a good fit (at least 20 characters).")
    .max(3000, "Cover message is too long (3000 characters max)."),
});

export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
