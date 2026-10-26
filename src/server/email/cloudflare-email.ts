import { syncCloudflareBindings } from "../cloudflare/sync-bindings";
import type { EmailSenderLike, EmailMessage } from "./email-like";

// Cloudflare Email Routing's "send_email" binding lets a Worker send email
// to a verified destination address at no cost, with no third-party
// provider at all — the cheapest option, but only available when this app
// is deployed directly to Cloudflare Workers/Pages (same constraint as the
// D1 and R2 bindings elsewhere in this codebase). See COST_NOTES.md.

interface SendEmailBindingLike {
  send(message: unknown): Promise<void>;
}

declare global {
  var __EMAIL_BINDING__: SendEmailBindingLike | undefined;
  var __EMAIL_FROM__: string | undefined;
  var __EMAIL_TO__: string | undefined;
}

export function getCloudflareEmailSender(): EmailSenderLike | null {
  syncCloudflareBindings();
  const binding = globalThis.__EMAIL_BINDING__;
  if (!binding) return null;
  const from = globalThis.__EMAIL_FROM__;
  const to = globalThis.__EMAIL_TO__;
  if (!from || !to) return null;

  return {
    async send(message: EmailMessage) {
      // Building a MIME message by hand to avoid pulling in a MIME library
      // for one plain-text notification email.
      const mime =
        `From: ${from}\r\n` +
        `To: ${to}\r\n` +
        `Subject: ${message.subject}\r\n` +
        `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
        message.text;
      await binding.send({ raw: mime });
    },
  };
}
