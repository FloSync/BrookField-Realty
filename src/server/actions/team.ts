"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import { teamMemberSchema } from "@/server/validation/schemas";
import {
  adminCreateTeamMember,
  adminUpdateTeamMember,
  adminDeleteTeamMember,
  adminSetTeamMemberPublished,
} from "@/server/db/queries/team";
import { revalidateTeam } from "@/server/revalidate";
import type { AdminTeamMemberInput } from "@/server/db/admin-types";

function parseTeamForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    position: formData.get("position"),
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl") ?? "",
    displayOrder: formData.get("displayOrder") || 0,
    published: formData.get("published") === "on",
  });
}

export async function createTeamMemberAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/team/new?error=${encodeURIComponent(message)}`);
  }

  const input: AdminTeamMemberInput = {
    ...parsed.data,
    photoUrl: parsed.data.photoUrl || undefined,
  };
  await adminCreateTeamMember(input);
  revalidateTeam();
  redirect(`/admin/team?success=${encodeURIComponent("Team member added.")}`);
}

export async function updateTeamMemberAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const parsed = parseTeamForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/team/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  const input: AdminTeamMemberInput = {
    ...parsed.data,
    photoUrl: parsed.data.photoUrl || undefined,
  };
  await adminUpdateTeamMember(id, input);
  revalidateTeam();
  redirect(`/admin/team/${id}/edit?success=${encodeURIComponent("Team member updated.")}`);
}

export async function deleteTeamMemberAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  await adminDeleteTeamMember(id);
  revalidateTeam();
  redirect(`/admin/team?success=${encodeURIComponent("Team member removed.")}`);
}

export async function toggleTeamMemberPublishedAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  await adminSetTeamMemberPublished(id, published);
  revalidateTeam();
  redirect(
    `/admin/team?success=${encodeURIComponent(published ? "Team member shown." : "Team member hidden.")}`
  );
}
