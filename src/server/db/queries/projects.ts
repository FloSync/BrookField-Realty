import { getDb } from "../index";
import { mapProject, type ProjectRow } from "../mappers";
import type { Project } from "@/lib/types";
import type { AdminProject, AdminProjectInput } from "../admin-types";

export async function getPublishedProjects(): Promise<Project[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM projects WHERE published = 1 ORDER BY created_at DESC")
    .all<ProjectRow>();
  return results.map(mapProject);
}

export async function getPublishedProjectBySlug(
  slug: string
): Promise<Project | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM projects WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<ProjectRow>();
  return row ? mapProject(row) : null;
}

export async function adminListProjects(): Promise<AdminProject[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all<ProjectRow>();
  return results.map(toAdminProject);
}

export async function adminGetProject(id: string): Promise<AdminProject | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .bind(id)
    .first<ProjectRow>();
  return row ? toAdminProject(row) : null;
}

function toAdminProject(row: ProjectRow): AdminProject {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location,
    description: row.description,
    status: row.status as AdminProject["status"],
    imageUrl: row.image_url ?? undefined,
    unitsInfo: row.units_info ?? undefined,
    published: !!row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function adminCreateProject(
  input: AdminProjectInput
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO projects (id, name, slug, location, description, status, image_url, units_info, published, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.name,
      input.slug,
      input.location,
      input.description,
      input.status,
      input.imageUrl ?? null,
      input.unitsInfo ?? null,
      input.published ? 1 : 0,
      now,
      now
    )
    .run();
  return id;
}

export async function adminUpdateProject(
  id: string,
  input: AdminProjectInput
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE projects SET name = ?, slug = ?, location = ?, description = ?, status = ?, image_url = ?, units_info = ?, published = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.name,
      input.slug,
      input.location,
      input.description,
      input.status,
      input.imageUrl ?? null,
      input.unitsInfo ?? null,
      input.published ? 1 : 0,
      now,
      id
    )
    .run();
}

export async function adminDeleteProject(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
}

export async function adminSetProjectPublished(
  id: string,
  published: boolean
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE projects SET published = ?, updated_at = ? WHERE id = ?")
    .bind(published ? 1 : 0, new Date().toISOString(), id)
    .run();
}
