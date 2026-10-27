import { syncCloudflareBindings } from "../cloudflare/sync-bindings";
import type { StorageLike, StoredObject } from "./storage-like";

// A real R2Bucket binding (env.RESUMES) implements .put() / .get() with
// this same shape. Returns storage keys only — CVs stay private; admins
// download via /api/admin/applications/[id]/resume.

interface R2ObjectLike {
  arrayBuffer(): Promise<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
}

interface R2BucketLike {
  put(
    key: string,
    data: Uint8Array,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectLike | null>;
}

declare global {
  var __R2_BINDING__: R2BucketLike | undefined;
}

export function getCloudflareR2(): StorageLike | null {
  syncCloudflareBindings();
  const bucket = globalThis.__R2_BINDING__;
  if (!bucket) return null;

  return {
    async put(key: string, data: Uint8Array, contentType: string) {
      await bucket.put(key, data, { httpMetadata: { contentType } });
      return key;
    },
    async get(key: string): Promise<StoredObject | null> {
      const object = await bucket.get(key);
      if (!object) return null;
      const buffer = await object.arrayBuffer();
      return {
        data: new Uint8Array(buffer),
        contentType:
          object.httpMetadata?.contentType ?? "application/octet-stream",
      };
    },
  };
}
