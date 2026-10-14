"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import { careerSchema, linesToList } from "@/server/validation/schemas";
import {
  adminCreateCareer,
  adminUpdateCareer,
  adminDeleteCareer,
  adminSetCareerStatus,
} from "@/server/db/queries/careers";
import { revalidateCareers } from "@/server/revalidate";
import type { AdminCareerInput } from "@/server/db/admin-types";

function parseCareerForm(formData: FormData) {
  return careerSchema.safeParse({
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    description: formData.get("description"),
    requirements: formData.get("requirements") ?? "",
    applicationInstructions: formData.get("applicationInstructions") ?? "",
    applicationContact: formData.get("applicationContact") ?? "",
    status: formData.get("status"),
  });
}

export async function createCareerAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const parsed = parseCareerForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/careers/new?error=${encodeURIComponent(message)}`);
  }

  const input: AdminCareerInput = {
    ...parsed.data,
    requirements: linesToList(parsed.data.requirements),
    applicationInstructions: parsed.data.applicationInstructions || undefined,
    applicationContact: parsed.data.applicationContact || undefined,
  };
  await adminCreateCareer(input);
  revalidateCareers();
  redirect(`/admin/careers?success=${encodeURIComponent("Vacancy created.")}`);
}

export async function updateCareerAction(
  id: string,
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const parsed = parseCareerForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/careers/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  const input: AdminCareerInput = {
    ...parsed.data,
    requirements: linesToList(parsed.data.requirements),
    applicationInstructions: parsed.data.applicationInstructions || undefined,
    applicationContact: parsed.data.applicationContact || undefined,
  };
  await adminUpdateCareer(id, input);
  revalidateCareers();
  redirect(`/admin/careers/${id}/edit?success=${encodeURIComponent("Vacancy updated.")}`);
}

export async function deleteCareerAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  await adminDeleteCareer(id);
  revalidateCareers();
  redirect(`/admin/careers?success=${encodeURIComponent("Vacancy archived.")}`);
}

export async function setCareerStatusAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["draft", "published", "closed", "archived"].includes(status)) {
    redirect(`/admin/careers?error=${encodeURIComponent("Invalid status.")}`);
  }
  await adminSetCareerStatus(
    id,
    status as "draft" | "published" | "closed" | "archived"
  );
  revalidateCareers();
  redirect(`/admin/careers?success=${encodeURIComponent("Vacancy status updated.")}`);
}
