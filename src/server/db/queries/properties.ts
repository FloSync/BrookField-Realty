import { getDb } from "../index";
import { mapProperty, type PropertyRow, type PropertyImageRow } from "../mappers";
import type { Property, PropertyCategory } from "@/lib/types";
import type { AdminProperty, AdminPropertyInput } from "../admin-types";
import {
  applyPropertyCatalogMeta,
  applyPropertyCatalogMetaList,
  HOME_LATEST_PROPERTY_SLUGS,
} from "@/lib/property-catalog-meta";

async function imagesFor(propertyId: string): Promise<PropertyImageRow[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM property_images WHERE property_id = ?")
    .bind(propertyId)
    .all<PropertyImageRow>();
  return results;
}

async function imagesForMany(
  propertyIds: string[]
): Promise<Map<string, PropertyImageRow[]>> {
  const map = new Map<string, PropertyImageRow[]>();
  if (propertyIds.length === 0) return map;
  const db = getDb();
  const placeholders = propertyIds.map(() => "?").join(",");
  const { results } = await db
    .prepare(
      `SELECT * FROM property_images WHERE property_id IN (${placeholders})`
    )
    .bind(...propertyIds)
    .all<PropertyImageRow>();
  for (const row of results) {
    const list = map.get(row.property_id) ?? [];
    list.push(row);
    map.set(row.property_id, list);
  }
  return map;
}

// --- Public reads ---------------------------------------------------

export async function getPublishedProperties(filters?: {
  category?: PropertyCategory;
  query?: string;
}): Promise<Property[]> {
  const db = getDb();
  let sql = "SELECT * FROM properties WHERE published = 1";
  const params: unknown[] = [];

  if (filters?.category) {
    sql += " AND category = ?";
    params.push(filters.category);
  }
  if (filters?.query) {
    sql += " AND (title LIKE ? OR location LIKE ? OR property_type LIKE ?)";
    const q = `%${filters.query}%`;
    params.push(q, q, q);
  }
  sql += " ORDER BY created_at DESC";

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<PropertyRow>();

  const imagesByProperty = await imagesForMany(results.map((r) => r.id));
  return applyPropertyCatalogMetaList(
    results.map((row) => mapProperty(row, imagesByProperty.get(row.id) ?? []))
  );
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const db = getDb();
  const { results } = await db
    .prepare(
      "SELECT * FROM properties WHERE published = 1 AND featured = 1 ORDER BY created_at DESC"
    )
    .all<PropertyRow>();
  const imagesByProperty = await imagesForMany(results.map((r) => r.id));
  return applyPropertyCatalogMetaList(
    results.map((row) => mapProperty(row, imagesByProperty.get(row.id) ?? []))
  );
}

export async function getInvestmentProperties(): Promise<Property[]> {
  return getPublishedProperties({ category: "investment" });
}

export async function getPublishedPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM properties WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<PropertyRow>();
  if (!row) return null;
  const images = await imagesFor(row.id);
  return applyPropertyCatalogMeta(mapProperty(row, images));
}

/** Published properties for the homepage row, in fixed display order. */
export async function getLatestHomeProperties(): Promise<Property[]> {
  const ordered: Property[] = [];
  for (const slug of HOME_LATEST_PROPERTY_SLUGS) {
    const property = await getPublishedPropertyBySlug(slug);
    if (property) ordered.push(property);
  }
  return ordered;
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT slug FROM properties WHERE published = 1")
    .all<{ slug: string }>();
  return results.map((r) => r.slug);
}

// --- Admin reads ---------------------------------------------------

export async function adminListProperties(): Promise<AdminProperty[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM properties ORDER BY updated_at DESC")
    .all<PropertyRow>();
  const imagesByProperty = await imagesForMany(results.map((r) => r.id));
  return results.map((row) => toAdminProperty(row, imagesByProperty.get(row.id) ?? []));
}

export async function adminGetProperty(id: string): Promise<AdminProperty | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM properties WHERE id = ?")
    .bind(id)
    .first<PropertyRow>();
  if (!row) return null;
  const images = await imagesFor(id);
  return toAdminProperty(row, images);
}

function toAdminProperty(
  row: PropertyRow,
  images: PropertyImageRow[]
): AdminProperty {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    propertyType: row.property_type,
    category: row.category as AdminProperty["category"],
    location: row.location,
    state: row.state,
    address: row.address ?? undefined,
    price: row.price,
    currency: row.currency as AdminProperty["currency"],
    priceNote: row.price_note ?? undefined,
    description: row.description,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    landSize: row.land_size ?? undefined,
    buildingSize: row.building_size ?? undefined,
    features: JSON.parse(row.features || "[]"),
    paymentPlan: row.payment_plan ?? undefined,
    availability: row.availability as AdminProperty["availability"],
    featured: !!row.featured,
    published: !!row.published,
    inspectionAvailable: !!row.inspection_available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: images
      .sort((a, b) => b.is_primary - a.is_primary || a.sort_order - b.sort_order)
      .map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        sortOrder: img.sort_order,
        isPrimary: !!img.is_primary,
      })),
  };
}

// --- Admin writes ---------------------------------------------------

export async function adminCreateProperty(
  input: AdminPropertyInput
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO properties (
        id, title, slug, property_type, category, location, state, address,
        price, currency, price_note, description, bedrooms, bathrooms,
        land_size, building_size, features, payment_plan, availability,
        featured, published, inspection_available, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.title,
      input.slug,
      input.propertyType,
      input.category,
      input.location,
      input.state,
      input.address ?? null,
      input.price,
      input.currency,
      input.priceNote ?? null,
      input.description,
      input.bedrooms ?? null,
      input.bathrooms ?? null,
      input.landSize ?? null,
      input.buildingSize ?? null,
      JSON.stringify(input.features),
      input.paymentPlan ?? null,
      input.availability,
      input.featured ? 1 : 0,
      input.published ? 1 : 0,
      input.inspectionAvailable ? 1 : 0,
      now,
      now
    )
    .run();
  return id;
}

export async function adminUpdateProperty(
  id: string,
  input: AdminPropertyInput
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE properties SET
        title = ?, slug = ?, property_type = ?, category = ?, location = ?,
        state = ?, address = ?, price = ?, currency = ?, price_note = ?,
        description = ?, bedrooms = ?, bathrooms = ?, land_size = ?,
        building_size = ?, features = ?, payment_plan = ?, availability = ?,
        featured = ?, published = ?, inspection_available = ?, updated_at = ?
      WHERE id = ?`
    )
    .bind(
      input.title,
      input.slug,
      input.propertyType,
      input.category,
      input.location,
      input.state,
      input.address ?? null,
      input.price,
      input.currency,
      input.priceNote ?? null,
      input.description,
      input.bedrooms ?? null,
      input.bathrooms ?? null,
      input.landSize ?? null,
      input.buildingSize ?? null,
      JSON.stringify(input.features),
      input.paymentPlan ?? null,
      input.availability,
      input.featured ? 1 : 0,
      input.published ? 1 : 0,
      input.inspectionAvailable ? 1 : 0,
      now,
      id
    )
    .run();
}

/** Single-purpose helper for the "change price" and "change availability"
 * flows called out explicitly in the brief — updates only that field
 * rather than requiring the full edit form. */
export async function adminUpdatePropertyPrice(
  id: string,
  price: number
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE properties SET price = ?, updated_at = ? WHERE id = ?")
    .bind(price, new Date().toISOString(), id)
    .run();
}

export async function adminUpdatePropertyAvailability(
  id: string,
  availability: "available" | "reserved" | "sold"
): Promise<void> {
  const db = getDb();
  await db
    .prepare(
      "UPDATE properties SET availability = ?, updated_at = ? WHERE id = ?"
    )
    .bind(availability, new Date().toISOString(), id)
    .run();
}

export async function adminDeleteProperty(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM properties WHERE id = ?").bind(id).run();
}

export async function adminSlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const db = getDb();
  const row = await db
    .prepare(
      excludeId
        ? "SELECT id FROM properties WHERE slug = ? AND id != ?"
        : "SELECT id FROM properties WHERE slug = ?"
    )
    .bind(...(excludeId ? [slug, excludeId] : [slug]))
    .first<{ id: string }>();
  return !!row;
}

// --- Admin: image management ---------------------------------------

export async function adminAddPropertyImage(
  propertyId: string,
  url: string,
  alt: string
): Promise<void> {
  const db = getDb();
  const existing = await imagesFor(propertyId);
  const id = crypto.randomUUID();
  const isFirst = existing.length === 0;
  await db
    .prepare(
      "INSERT INTO property_images (id, property_id, url, alt, sort_order, is_primary) VALUES (?,?,?,?,?,?)"
    )
    .bind(id, propertyId, url, alt, existing.length, isFirst ? 1 : 0)
    .run();
}

export async function adminRemovePropertyImage(imageId: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM property_images WHERE id = ?").bind(imageId).run();
}

export async function adminSetPrimaryImage(
  propertyId: string,
  imageId: string
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE property_images SET is_primary = 0 WHERE property_id = ?")
    .bind(propertyId)
    .run();
  await db
    .prepare("UPDATE property_images SET is_primary = 1 WHERE id = ?")
    .bind(imageId)
    .run();
}

export async function adminReorderPropertyImages(
  propertyId: string,
  orderedImageIds: string[]
): Promise<void> {
  const db = getDb();
  for (let i = 0; i < orderedImageIds.length; i++) {
    await db
      .prepare(
        "UPDATE property_images SET sort_order = ? WHERE id = ? AND property_id = ?"
      )
      .bind(i, orderedImageIds[i], propertyId)
      .run();
  }
}
