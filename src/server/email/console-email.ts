import fs from "node:fs";
import path from "node:path";
import type { EmailSenderLike, EmailMessage } from "./email-like";

function logFilePath(): string {
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "notifications.log");
}

export function getConsoleEmailSender(): EmailSenderLike {
  return {
    async send(message: EmailMessage) {
      const entry = `\n--- ${new Date().toISOString()} ---\nSubject: ${message.subject}\n\n${message.text}\n`;
      console.log("[email:dev-fallback]", entry);
      fs.appendFileSync(logFilePath(), entry);
    },
  };
}
