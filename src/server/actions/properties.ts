"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import { propertySchema, linesToList } from "@/server/validation/schemas";
import {
  adminCreateProperty,
  adminUpdateProperty,
  adminDeleteProperty,
  adminUpdatePropertyPrice,
  adminUpdatePropertyAvailability,
  adminSlugExists,
  adminAddPropertyImage,
  adminRemovePropertyImage,
  adminSetPrimaryImage,
  adminGetProperty,
} from "@/server/db/queries/properties";
import { revalidateProperties } from "@/server/revalidate";
import type { AdminPropertyInput } from "@/server/db/admin-types";

function parsePropertyForm(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    propertyType: formData.get("propertyType"),
    category: formData.get("category"),
    location: formData.get("location"),
    state: formData.get("state"),
    address: formData.get("address") ?? "",
    price: formData.get("price"),
    currency: formData.get("currency"),
    priceNote: formData.get("priceNote") ?? "",
    description: formData.get("description"),
    bedrooms: formData.get("bedrooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    landSize: formData.get("landSize") ?? "",
    buildingSize: formData.get("buildingSize") ?? "",
    features: formData.get("features") ?? "",
    paymentPlan: formData.get("paymentPlan") ?? "",
    availability: formData.get("availability"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    inspectionAvailable: formData.get("inspectionAvailable") === "on",
  };
  return propertySchema.safeParse(raw);
}

export async function createPropertyAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/properties/new?error=${encodeURIComponent(message)}`);
  }

  const slugTaken = await adminSlugExists(parsed.data.slug);
  if (slugTaken) {
    redirect(
      `/admin/properties/new?error=${encodeURIComponent("That slug is already in use.")}`
    );
  }

  const input: AdminPropertyInput = {
    ...parsed.data,
    address: parsed.data.address || undefined,
    priceNote: parsed.data.priceNote || undefined,
    landSize: parsed.data.landSize || undefined,
    buildingSize: parsed.data.buildingSize || undefined,
    paymentPlan: parsed.data.paymentPlan || undefined,
    features: linesToList(parsed.data.features),
  };

  const id = await adminCreateProperty(input);
  revalidateProperties(parsed.data.slug);
  redirect(`/admin/properties/${id}/edit?success=${encodeURIComponent("Property created.")}`);
}

export async function updatePropertyAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/properties/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  const slugTaken = await adminSlugExists(parsed.data.slug, id);
  if (slugTaken) {
    redirect(
      `/admin/properties/${id}/edit?error=${encodeURIComponent("That slug is already in use.")}`
    );
  }

  const existing = await adminGetProperty(id);

  const input: AdminPropertyInput = {
    ...parsed.data,
    address: parsed.data.address || undefined,
    priceNote: parsed.data.priceNote || undefined,
    landSize: parsed.data.landSize || undefined,
    buildingSize: parsed.data.buildingSize || undefined,
    paymentPlan: parsed.data.paymentPlan || undefined,
    features: linesToList(parsed.data.features),
  };

  await adminUpdateProperty(id, input);
  revalidateProperties(parsed.data.slug);
  if (existing && existing.slug !== parsed.data.slug) revalidateProperties(existing.slug);
  redirect(`/admin/properties/${id}/edit?success=${encodeURIComponent("Property updated.")}`);
}

export async function deletePropertyAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const property = await adminGetProperty(id);
  await adminDeleteProperty(id);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties?success=${encodeURIComponent("Property deleted.")}`);
}

export async function quickUpdatePriceAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const price = Number(formData.get("price"));
  if (!id || !Number.isFinite(price) || price <= 0) {
    redirect(`/admin/properties?error=${encodeURIComponent("Enter a valid price.")}`);
  }
  await adminUpdatePropertyPrice(id, price);
  const property = await adminGetProperty(id);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties?success=${encodeURIComponent("Price updated.")}`);
}

export async function quickUpdateAvailabilityAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const availability = String(formData.get("availability") ?? "");
  if (!["available", "reserved", "sold"].includes(availability)) {
    redirect(`/admin/properties?error=${encodeURIComponent("Invalid availability status.")}`);
  }
  await adminUpdatePropertyAvailability(
    id,
    availability as "available" | "reserved" | "sold"
  );
  const property = await adminGetProperty(id);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties?success=${encodeURIComponent("Availability updated.")}`);
}

// --- Images -----------------------------------------------------------

export async function addPropertyImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const propertyId = String(formData.get("propertyId") ?? "");
  const url = String(formData.get("url") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();

  if (!propertyId || !url) {
    redirect(
      `/admin/properties/${propertyId}/edit?error=${encodeURIComponent("Image URL is required.")}`
    );
  }

  await adminAddPropertyImage(propertyId, url, alt || "Property photo");
  const property = await adminGetProperty(propertyId);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties/${propertyId}/edit?success=${encodeURIComponent("Image added.")}`);
}

export async function removePropertyImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const propertyId = String(formData.get("propertyId") ?? "");
  const imageId = String(formData.get("imageId") ?? "");
  await adminRemovePropertyImage(imageId);
  const property = await adminGetProperty(propertyId);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties/${propertyId}/edit?success=${encodeURIComponent("Image removed.")}`);
}

export async function setPrimaryImageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const propertyId = String(formData.get("propertyId") ?? "");
  const imageId = String(formData.get("imageId") ?? "");
  await adminSetPrimaryImage(propertyId, imageId);
  const property = await adminGetProperty(propertyId);
  revalidateProperties(property?.slug);
  redirect(`/admin/properties/${propertyId}/edit?success=${encodeURIComponent("Cover photo updated.")}`);
}
