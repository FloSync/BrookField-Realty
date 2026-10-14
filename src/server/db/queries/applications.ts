import { getDb } from "../index";

export interface CareerApplicationRow {
  id: string;
  career_id: string | null;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  cover_message: string;
  resume_url: string | null;
  resume_filename: string | null;
  status: string;
  created_at: string;
}

export interface CreateApplicationInput {
  careerId?: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverMessage: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

export async function createCareerApplication(
  input: CreateApplicationInput
): Promise<string> {
  const db = getDb();
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO career_applications (
        id, career_id, job_title, name, email, phone, cover_message,
        resume_url, resume_filename, status, created_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      input.careerId ?? null,
      input.jobTitle,
      input.name,
      input.email,
      input.phone,
      input.coverMessage,
      input.resumeUrl ?? null,
      input.resumeFilename ?? null,
      "new",
      new Date().toISOString()
    )
    .run();
  return id;
}

export async function adminListApplications(): Promise<CareerApplicationRow[]> {
  const db = getDb();
  const { results } = await db
    .prepare("SELECT * FROM career_applications ORDER BY created_at DESC")
    .all<CareerApplicationRow>();
  return results;
}

export async function adminSetApplicationStatus(
  id: string,
  status: "new" | "reviewed"
): Promise<void> {
  const db = getDb();
  await db
    .prepare("UPDATE career_applications SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();
}
