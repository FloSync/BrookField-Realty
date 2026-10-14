import fs from "node:fs";
import path from "node:path";
import type { StorageLike } from "./storage-like";

// Files land in public/uploads so Next.js serves them directly at
// /uploads/<key> during local dev — a faithful stand-in for "a URL the
// public site can reach", the same property the real R2 adapter provides.

function uploadsDir(): string {
  const dir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getLocalStorage(): StorageLike {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by the StorageLike interface even though the local adapter doesn't need it
    async put(key: string, data: Uint8Array, _contentType: string) {
      const dir = uploadsDir();
      const filePath = path.join(dir, key);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, data);
      return `/uploads/${key}`;
    },
  };
}
