import { getDb } from "../index";
import { mapCareer, type CareerRow } from "../mappers";
import type { JobOpening } from "@/lib/types";
import type { AdminCareer, AdminCareerInput } from "../admin-types";

export async function getPublishedCareers(): Promise<JobOpening[]> {
  const db = getDb();
  const { results } = await db
    .prepare(
      "SELECT * FROM careers WHERE status = 'published' ORDER BY posted_at DESC"
    )
    .all<CareerRow>();
  return results.map(mapCareer);
}

export async function adminListCareers(): Promise<AdminCareer[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM careers ORDER BY updated_at DESC")
    .all<CareerRow>();
  return results.map(toAdminCareer);
}

export async function adminGetCareer(id: string): Promise<AdminCareer | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM careers WHERE id = ?")
    .bind(id)
    .first<CareerRow>();
  return row ? toAdminCareer(row) : null;
}

function toAdminCareer(row: CareerRow): AdminCareer {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type as AdminCareer["employmentType"],
    description: row.description,
    requirements: JSON.parse(row.requirements || "[]"),
    applicationInstructions: row.application_instructions ?? undefined,
    applicationContact: row.application_contact ?? undefined,
    status: row.status as AdminCareer["status"],
    postedAt: row.posted_at ?? undefined,
    closingAt: row.closing_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function adminCreateCareer(
  input: AdminCareerInput
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO careers (
        id, title, department, location, employment_type, description,
        requirements, application_instructions, application_contact,
        status, posted_at, closing_at, created_at, updated_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.title,
      input.department,
      input.location,
      input.employmentType,
      input.description,
      JSON.stringify(input.requirements),
      input.applicationInstructions ?? null,
      input.applicationContact ?? null,
      input.status,
      input.status === "published" ? input.postedAt ?? now : input.postedAt ?? null,
      input.closingAt ?? null,
      now,
      now
    )
    .run();
  return id;
}

export async function adminUpdateCareer(
  id: string,
  input: AdminCareerInput
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE careers SET title = ?, department = ?, location = ?, employment_type = ?,
        description = ?, requirements = ?, application_instructions = ?,
        application_contact = ?, status = ?, posted_at = ?, closing_at = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.title,
      input.department,
      input.location,
      input.employmentType,
      input.description,
      JSON.stringify(input.requirements),
      input.applicationInstructions ?? null,
      input.applicationContact ?? null,
      input.status,
      input.postedAt ?? null,
      input.closingAt ?? null,
      now,
      id
    )
    .run();
}

export async function adminSetCareerStatus(
  id: string,
  status: "draft" | "published" | "closed" | "archived"
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  if (status === "published") {
    await db
      .prepare(
        "UPDATE careers SET status = ?, posted_at = COALESCE(posted_at, ?), updated_at = ? WHERE id = ?"
      )
      .bind(status, now, now, id)
      .run();
  } else {
    await db
      .prepare("UPDATE careers SET status = ?, updated_at = ? WHERE id = ?")
      .bind(status, now, id)
      .run();
  }
}

export async function adminDeleteCareer(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM careers WHERE id = ?").bind(id).run();
}
