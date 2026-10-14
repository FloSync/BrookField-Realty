import type { EmailSenderLike, EmailMessage } from "./email-like";

// Resend's free tier (100 emails/day, 3,000/month) comfortably covers
// Brookfield's expected enquiry volume — see COST_NOTES.md. A plain fetch
// call is enough; no SDK needed for a single transactional message type.

export function getResendEmailSender(config: {
  apiKey: string;
  from: string;
  to: string;
}): EmailSenderLike {
  return {
    async send(message: EmailMessage) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          subject: message.subject,
          text: message.text,
        }),
      });
      if (!res.ok) {
        throw new Error(`Resend request failed with status ${res.status}`);
      }
    },
  };
}
