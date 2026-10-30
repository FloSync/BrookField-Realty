import fs from "node:fs";
import path from "node:path";
import type { StoredObject } from "@/server/storage/storage-like";

function contentTypeFromExtension(ext: string): string {
  switch (ext.toLowerCase()) {
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

/** Loads CV bytes for applications stored before private storage (public URL or /uploads). */
export async function loadLegacyResume(
  resumeUrl: string
): Promise<StoredObject | null> {
  if (resumeUrl.startsWith("/uploads/")) {
    const relative = resumeUrl.slice("/uploads/".length);
    if (relative.includes("..")) return null;
    const filePath = path.join(process.cwd(), "public", "uploads", relative);
    if (!fs.existsSync(filePath)) return null;
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1);
    return {
      data: new Uint8Array(data),
      contentType: contentTypeFromExtension(ext),
    };
  }

  if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
    try {
      const res = await fetch(resumeUrl);
      if (!res.ok) return null;
      const data = new Uint8Array(await res.arrayBuffer());
      const contentType =
        res.headers.get("content-type") ?? "application/octet-stream";
      return { data, contentType };
    } catch {
      return null;
    }
  }

  return null;
}

export function sanitizeResumeDownloadFilename(name: string | null): string {
  const base =
    (name ?? "resume").replace(/[^\w\s.-]/g, "").trim() || "resume";
  return base.slice(0, 200);
}
