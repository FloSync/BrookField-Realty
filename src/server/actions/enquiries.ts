"use server";

import { enquirySchema } from "@/server/validation/schemas";
import { checkHoneypotAndTiming, verifyTurnstile } from "@/server/spam-guard";
import {
  createEnquiry,
  adminSetEnquiryStatus,
} from "@/server/db/queries/enquiries";
import { getPublishedPropertyBySlug } from "@/server/db/queries/properties";
import { sendEnquiryNotification } from "@/server/email/notifications";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "./require-session";
import type { EnquiryFormState } from "./form-state";

export async function submitEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const spam = checkHoneypotAndTiming(formData);
  if (!spam.passed) {
    // Bots get a generic success-looking response so they don't learn
    // anything from the rejection — the submission is simply dropped.
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

  const parsed = enquirySchema.safeParse({
    enquiryType: formData.get("enquiryType"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    propertySlug: formData.get("propertySlug") ?? "",
    preferredInspectionDate: formData.get("preferredInspectionDate") ?? "",
    preferredInspectionTime: formData.get("preferredInspectionTime") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  if (parsed.data.enquiryType === "inspection" && !parsed.data.preferredInspectionDate) {
    return { status: "error", message: "Choose a preferred inspection date." };
  }

  let propertySnapshot: {
    propertyId?: string;
    propertyTitle?: string;
    propertyLocation?: string;
    propertyPriceSnapshot?: number;
    propertyCurrencySnapshot?: string;
  } = {};

  if (parsed.data.propertySlug) {
    // Looking the property up server-side (rather than trusting hidden
    // title/price fields from the client) so the snapshot can't be spoofed.
    const property = await getPublishedPropertyBySlug(parsed.data.propertySlug);
    if (property) {
      propertySnapshot = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: `${property.location}, ${property.state}`,
        propertyPriceSnapshot: property.price,
        propertyCurrencySnapshot: property.currency,
      };
    }
  }

  try {
    await createEnquiry({
      enquiryType: parsed.data.enquiryType,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message:
        parsed.data.message?.trim() ||
        (parsed.data.enquiryType === "inspection"
          ? "No additional message provided."
          : ""),
      preferredInspectionDate: parsed.data.preferredInspectionDate || undefined,
      preferredInspectionTime: parsed.data.preferredInspectionTime || undefined,
      ...propertySnapshot,
    });

    await sendEnquiryNotification({
      enquiryType: parsed.data.enquiryType,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      message:
        parsed.data.message?.trim() ||
        (parsed.data.enquiryType === "inspection"
          ? "No additional message provided."
          : ""),
      propertyTitle: propertySnapshot.propertyTitle,
      propertyLocation: propertySnapshot.propertyLocation,
      propertyPriceSnapshot: propertySnapshot.propertyPriceSnapshot,
      propertyCurrencySnapshot: propertySnapshot.propertyCurrencySnapshot,
      preferredInspectionDate: parsed.data.preferredInspectionDate || undefined,
      preferredInspectionTime: parsed.data.preferredInspectionTime || undefined,
    });

    revalidatePath("/admin/enquiries");

    return {
      status: "success",
      message:
        "Thank you. Your enquiry has been received. A member of the Brookfield team will contact you shortly.",
    };
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    return {
      status: "error",
      message:
        "Something went wrong on our end. Please try again, or contact us directly on WhatsApp or by phone.",
    };
  }
}

// --- Admin ---------------------------------------------------------------

export async function adminUpdateEnquiryStatusAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const validStatuses = ["new", "contacted", "in_progress", "completed", "closed"];
  if (!validStatuses.includes(status)) {
    redirect(`/admin/enquiries?error=${encodeURIComponent("Invalid status.")}`);
  }
  await adminSetEnquiryStatus(
    id,
    status as "new" | "contacted" | "in_progress" | "completed" | "closed"
  );
  redirect(`/admin/enquiries?success=${encodeURIComponent("Status updated.")}`);
}
