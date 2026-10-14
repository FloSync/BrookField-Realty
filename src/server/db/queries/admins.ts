import { getDb } from "../index";

export interface AdminAccountRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function findAdminByEmail(
  email: string
): Promise<AdminAccountRow | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT * FROM admins WHERE email = ?")
    .bind(email.toLowerCase().trim())
    .first<AdminAccountRow>();
  return row ?? null;
}

export async function createAdmin(
  email: string,
  passwordHash: string
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  await db
    .prepare(
      "INSERT INTO admins (id, email, password_hash, created_at) VALUES (?,?,?,?)"
    )
    .bind(id, email.toLowerCase().trim(), passwordHash, new Date().toISOString())
    .run();
  return id;
}

export async function adminAccountCount(): Promise<number> {
  const db = getDb();
  const row = await db
    .prepare("SELECT COUNT(*) as count FROM admins")
    .first<{ count: number }>();
  return row?.count ?? 0;
}
