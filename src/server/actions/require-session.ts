import { getSession } from "@/server/auth/session";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: no active admin session.");
  }
  return session;
}
