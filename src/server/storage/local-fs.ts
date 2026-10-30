import fs from "node:fs";
import path from "node:path";
import type { StorageLike, StoredObject } from "./storage-like";

// Private local storage — not web-accessible. Admin downloads go through
// /api/admin/applications/[id]/resume.

function resumesDir(): string {
  const dir = path.join(process.cwd(), ".data", "resumes");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function contentTypeFromKey(key: string): string {
  const ext = path.extname(key).slice(1).toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream";
  }
}

function resolveKeyPath(key: string): string | null {
  if (!key || key.includes("..") || path.isAbsolute(key)) return null;
  const normalized = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
  if (normalized.startsWith("..") || path.isAbsolute(normalized)) return null;
  return path.join(resumesDir(), normalized);
}

export function getLocalStorage(): StorageLike {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by StorageLike
    async put(key: string, data: Uint8Array, _contentType: string) {
      const filePath = resolveKeyPath(key);
      if (!filePath) throw new Error("Invalid storage key.");
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, data);
      return key;
    },
    async get(key: string): Promise<StoredObject | null> {
      const filePath = resolveKeyPath(key);
      if (!filePath || !fs.existsSync(filePath)) return null;
      const data = fs.readFileSync(filePath);
      return {
        data: new Uint8Array(data),
        contentType: contentTypeFromKey(key),
      };
    },
  };
}
