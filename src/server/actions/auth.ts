"use server";

import { redirect } from "next/navigation";
import { login } from "@/server/auth/login";
import { clearSessionCookie } from "@/server/auth/session";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!email || !password) {
    redirect(`/admin/login?error=${encodeURIComponent("Enter your email and password.")}`);
  }

  const result = await login(email, password);
  if (!result.success) {
    redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);
  }

  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
