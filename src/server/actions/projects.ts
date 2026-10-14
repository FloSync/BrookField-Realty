"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import { projectSchema } from "@/server/validation/schemas";
import {
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminSetProjectPublished,
} from "@/server/db/queries/projects";
import { revalidateProjects } from "@/server/revalidate";
import type { AdminProjectInput } from "@/server/db/admin-types";

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    location: formData.get("location"),
    description: formData.get("description"),
    status: formData.get("status"),
    imageUrl: formData.get("imageUrl") ?? "",
    unitsInfo: formData.get("unitsInfo") ?? "",
    published: formData.get("published") === "on",
  });
}

export async function createProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/projects/new?error=${encodeURIComponent(message)}`);
  }

  const input: AdminProjectInput = {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || undefined,
    unitsInfo: parsed.data.unitsInfo || undefined,
  };
  await adminCreateProject(input);
  revalidateProjects();
  redirect(`/admin/projects?success=${encodeURIComponent("Project created.")}`);
}

export async function updateProjectAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  const input: AdminProjectInput = {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || undefined,
    unitsInfo: parsed.data.unitsInfo || undefined,
  };
  await adminUpdateProject(id, input);
  revalidateProjects();
  redirect(`/admin/projects/${id}/edit?success=${encodeURIComponent("Project updated.")}`);
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  await adminDeleteProject(id);
  revalidateProjects();
  redirect(`/admin/projects?success=${encodeURIComponent("Project deleted.")}`);
}

export async function toggleProjectPublishedAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  await adminSetProjectPublished(id, published);
  revalidateProjects();
  redirect(
    `/admin/projects?success=${encodeURIComponent(published ? "Project published." : "Project unpublished.")}`
  );
}
