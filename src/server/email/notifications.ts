import { getEmailSender } from "./index";
import { formatPrice } from "@/lib/utils";

const enquiryTypeLabels: Record<string, string> = {
  general: "General enquiry",
  property: "Property enquiry",
  inspection: "Inspection request",
  investment: "Investment enquiry",
};

export interface EnquiryNotificationInput {
  enquiryType: "general" | "property" | "inspection" | "investment";
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyTitle?: string | null;
  propertyLocation?: string | null;
  propertyPriceSnapshot?: number | null;
  propertyCurrencySnapshot?: string | null;
  preferredInspectionDate?: string | null;
  preferredInspectionTime?: string | null;
}

export async function sendEnquiryNotification(
  input: EnquiryNotificationInput
): Promise<void> {
  const lines = [
    `Type: ${enquiryTypeLabels[input.enquiryType]}`,
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
  ];

  if (input.propertyTitle) {
    lines.push(`Property: ${input.propertyTitle}`);
    if (input.propertyLocation) lines.push(`Location: ${input.propertyLocation}`);
    if (input.propertyPriceSnapshot && input.propertyCurrencySnapshot) {
      lines.push(
        `Price at time of enquiry: ${formatPrice(
          input.propertyPriceSnapshot,
          input.propertyCurrencySnapshot as "NGN" | "USD"
        )}`
      );
    }
  }

  if (input.preferredInspectionDate) {
    lines.push(
      `Preferred inspection: ${input.preferredInspectionDate}${
        input.preferredInspectionTime ? ` at ${input.preferredInspectionTime}` : ""
      }`
    );
  }

  lines.push("", "Message:", input.message);

  try {
    await getEmailSender().send({
      subject: `New ${enquiryTypeLabels[input.enquiryType].toLowerCase()} — ${input.name}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    // A notification failure should never fail the visitor's submission —
    // the enquiry is already safely saved in D1 by the time this runs, and
    // admins can still see it in /admin/enquiries either way.
    console.error("Failed to send enquiry notification email:", err);
  }
}

export async function sendApplicationNotification(input: {
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverMessage: string;
  hasResume?: boolean;
}): Promise<void> {
  const lines = [
    `Position: ${input.jobTitle}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
  ];
  if (input.hasResume) {
    lines.push(
      "CV: attached — sign in to the admin dashboard (Applications) to download."
    );
  }
  lines.push("", "Cover message:", input.coverMessage);

  try {
    await getEmailSender().send({
      subject: `New application — ${input.jobTitle} — ${input.name}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("Failed to send application notification email:", err);
  }
}
