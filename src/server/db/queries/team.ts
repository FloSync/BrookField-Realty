import { getDb } from "../index";
import { mapTeamMember, type TeamMemberRow } from "../mappers";
import type { TeamMember } from "@/lib/types";
import type { AdminTeamMember, AdminTeamMemberInput } from "../admin-types";

export async function getPublishedTeam(): Promise<TeamMember[]> {
  const db = getDb();
  const { results } = await db
    .prepare(
      "SELECT * FROM team_members WHERE published = 1 ORDER BY display_order ASC"
    )
    .all<TeamMemberRow>();
  return results.map(mapTeamMember);
}

export async function adminListTeam(): Promise<AdminTeamMember[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM team_members ORDER BY display_order ASC")
    .all<TeamMemberRow>();
  return results.map(toAdminTeamMember);
}

export async function adminGetTeamMember(
  id: string
): Promise<AdminTeamMember | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM team_members WHERE id = ?")
    .bind(id)
    .first<TeamMemberRow>();
  return row ? toAdminTeamMember(row) : null;
}

function toAdminTeamMember(row: TeamMemberRow): AdminTeamMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    bio: row.bio,
    photoUrl: row.photo_url ?? undefined,
    displayOrder: row.display_order,
    published: !!row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function adminCreateTeamMember(
  input: AdminTeamMemberInput
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO team_members (id, name, position, bio, photo_url, display_order, published, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.name,
      input.position,
      input.bio,
      input.photoUrl ?? null,
      input.displayOrder,
      input.published ? 1 : 0,
      now,
      now
    )
    .run();
  return id;
}

export async function adminUpdateTeamMember(
  id: string,
  input: AdminTeamMemberInput
): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await db
    .prepare(
      `UPDATE team_members SET name = ?, position = ?, bio = ?, photo_url = ?, display_order = ?, published = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      input.name,
      input.position,
      input.bio,
      input.photoUrl ?? null,
      input.displayOrder,
      input.published ? 1 : 0,
      now,
      id
    )
    .run();
}

export async function adminDeleteTeamMember(id: string): Promise<void> {
  const db = getDb();
  await db.prepare("DELETE FROM team_members WHERE id = ?").bind(id).run();
}

export async function adminSetTeamMemberPublished(
  id: string,
  published: boolean
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE team_members SET published = ?, updated_at = ? WHERE id = ?")
    .bind(published ? 1 : 0, new Date().toISOString(), id)
    .run();
}
