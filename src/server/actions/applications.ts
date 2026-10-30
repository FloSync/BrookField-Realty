"use server";

import {
  careerApplicationSchema,
  ALLOWED_RESUME_TYPES,
  MAX_RESUME_BYTES,
} from "@/server/validation/schemas";
import { checkHoneypotAndTiming, verifyTurnstile } from "@/server/spam-guard";
import {
  createCareerApplication,
  adminSetApplicationStatus,
} from "@/server/db/queries/applications";
import { getStorage } from "@/server/storage";
import { sendApplicationNotification } from "@/server/email/notifications";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import type { ApplicationFormState } from "./form-state";

export async function submitApplicationAction(
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const spam = checkHoneypotAndTiming(formData);
  if (!spam.passed) {
    return { status: "success" };
  }

  const turnstileOk = await verifyTurnstile(
    (formData.get("cf-turnstile-response") as string) || null
  );
  if (!turnstileOk) {
    return {
      status: "error",
      message: "We couldn't verify your submission. Please try again.",
    };
  }

  const parsed = careerApplicationSchema.safeParse({
    careerId: formData.get("careerId") ?? "",
    jobTitle: formData.get("jobTitle"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    coverMessage: formData.get("coverMessage"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  // --- Resume upload (optional) --------------------------------------
  let resumeStorageKey: string | undefined;
  let resumeFilename: string | undefined;

  const file = formData.get("resume");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      return {
        status: "error",
        message: "CV must be a PDF or Word document (.pdf, .doc, .docx).",
      };
    }
    if (file.size > MAX_RESUME_BYTES) {
      return { status: "error", message: "CV must be under 5MB." };
    }

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const extension = file.name.split(".").pop() || "pdf";
      const key = `resumes/${crypto.randomUUID()}.${extension}`;
      resumeStorageKey = await getStorage().put(key, bytes, file.type);
      resumeFilename = file.name;
    } catch (err) {
      console.error("Failed to store resume:", err);
      return {
        status: "error",
        message: "We couldn't upload your CV. Please try again.",
      };
    }
  }

  try {
    await createCareerApplication({
      careerId: parsed.data.careerId || undefined,
      jobTitle: parsed.data.jobTitle,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      coverMessage: parsed.data.coverMessage,
      resumeStorageKey,
      resumeFilename,
    });

    await sendApplicationNotification({
      jobTitle: parsed.data.jobTitle,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      coverMessage: parsed.data.coverMessage,
      hasResume: Boolean(resumeStorageKey),
    });

    revalidatePath("/admin/applications");

    return {
      status: "success",
      message:
        "Thank you for applying. Your application has been received — the Brookfield team will review it and reach out if there's a fit.",
    };
  } catch (err) {
    console.error("Failed to save application:", err);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again shortly.",
    };
  }
}

// --- Admin ---------------------------------------------------------------

export async function adminUpdateApplicationStatusAction(
  formData: FormData
): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["new", "reviewed"].includes(status)) {
    redirect(`/admin/applications?error=${encodeURIComponent("Invalid status.")}`);
  }
  await adminSetApplicationStatus(id, status as "new" | "reviewed");
  redirect(`/admin/applications?success=${encodeURIComponent("Status updated.")}`);
}
