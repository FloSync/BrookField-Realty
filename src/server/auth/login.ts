import { findAdminByEmail } from "@/server/db/queries/admins";
import { verifyPassword } from "./password";
import { createSessionCookie } from "./session";

export async function login(
  email: string,
  password: string
): Promise<{ success: true } | { success: false; error: string }> {
  const account = await findAdminByEmail(email);
  if (!account) {
    return { success: false, error: "Invalid email or password." };
  }
  const valid = await verifyPassword(password, account.password_hash);
  if (!valid) {
    return { success: false, error: "Invalid email or password." };
  }
  await createSessionCookie({ adminId: account.id, email: account.email });
  return { success: true };
}
