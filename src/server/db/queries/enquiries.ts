import { getDb } from "../index";

export interface EnquiryRow {
  id: string;
  enquiry_type: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  property_id: string | null;
  property_title: string | null;
  property_location: string | null;
  property_price_snapshot: number | null;
  property_currency_snapshot: string | null;
  preferred_inspection_date: string | null;
  preferred_inspection_time: string | null;
  status: string;
  created_at: string;
}

export interface CreateEnquiryInput {
  enquiryType: "general" | "property" | "inspection" | "investment";
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyPriceSnapshot?: number;
  propertyCurrencySnapshot?: string;
  preferredInspectionDate?: string;
  preferredInspectionTime?: string;
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO enquiries (
        id, enquiry_type, name, phone, email, message, property_id,
        property_title, property_location, property_price_snapshot,
        property_currency_snapshot, preferred_inspection_date,
        preferred_inspection_time, status, created_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.enquiryType,
      input.name,
      input.phone,
      input.email,
      input.message,
      input.propertyId ?? null,
      input.propertyTitle ?? null,
      input.propertyLocation ?? null,
      input.propertyPriceSnapshot ?? null,
      input.propertyCurrencySnapshot ?? null,
      input.preferredInspectionDate ?? null,
      input.preferredInspectionTime ?? null,
      "new",
      new Date().toISOString()
    )
    .run();
  return id;
}

export async function adminListEnquiries(): Promise<EnquiryRow[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM enquiries ORDER BY created_at DESC")
    .all<EnquiryRow>();
  return results;
}

export async function adminSetEnquiryStatus(
  id: string,
  status: "new" | "contacted" | "in_progress" | "completed" | "closed"
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE enquiries SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();
}

export async function adminEnquiryCounts(): Promise<{ total: number; new: number }> {
  const db = getDb();
  const total = await db
    .prepare("SELECT COUNT(*) as count FROM enquiries")
    .first<{ count: number }>();
  const fresh = await db
    .prepare("SELECT COUNT(*) as count FROM enquiries WHERE status = 'new'")
    .first<{ count: number }>();
  return { total: total?.count ?? 0, new: fresh?.count ?? 0 };
}
