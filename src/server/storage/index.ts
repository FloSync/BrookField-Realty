import type { StorageLike } from "./storage-like";
import { getLocalStorage } from "./local-fs";
import { getCloudflareR2 } from "./cloudflare-r2";

let cached: StorageLike | null = null;

export function getStorage(): StorageLike {
  const r2 = getCloudflareR2();
  if (r2) return r2;
  if (cached) return cached;
  cached = getLocalStorage();
  return cached;
}
