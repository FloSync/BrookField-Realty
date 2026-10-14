import type { EmailSenderLike } from "./email-like";
import { getCloudflareEmailSender } from "./cloudflare-email";
import { getResendEmailSender } from "./resend-email";
import { getConsoleEmailSender } from "./console-email";

let cached: EmailSenderLike | null = null;

export function getEmailSender(): EmailSenderLike {
  const cf = getCloudflareEmailSender();
  if (cf) return cf;

  if (cached) return cached;

  const { RESEND_API_KEY, NOTIFY_FROM_EMAIL, NOTIFY_TO_EMAIL } = process.env;
  if (RESEND_API_KEY && NOTIFY_FROM_EMAIL && NOTIFY_TO_EMAIL) {
    cached = getResendEmailSender({
      apiKey: RESEND_API_KEY,
      from: NOTIFY_FROM_EMAIL,
      to: NOTIFY_TO_EMAIL,
    });
    return cached;
  }

  cached = getConsoleEmailSender();
  return cached;
}
