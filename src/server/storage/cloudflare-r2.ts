import { syncCloudflareBindings } from "../cloudflare/sync-bindings";
import type { StorageLike } from "./storage-like";

// A real R2Bucket binding (env.RESUMES, say) already implements .put() with
// this same shape, so this file just wraps it to also return a public URL.
// See src/server/db/README.md for the equivalent D1 binding-wiring notes —
// the same globalThis bridge pattern is used here.
//
// R2 also exposes an S3-compatible REST API for hosting outside Cloudflare's
// own runtime, the same way D1 has an HTTP Query API fallback. It isn't
// implemented here: it requires AWS SigV4 request signing, which is enough
// extra surface area (and a plausible source of subtle bugs) that it isn't
// worth adding until this app is actually hosted somewhere other than
// Cloudflare Pages/Workers. If that's needed later, the `aws4fetch` package
// (a few KB, no AWS SDK dependency) is the lightweight way to sign R2
// REST requests.

interface R2BucketLike {
  put(key: string, data: Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}

declare global {
  var __R2_BINDING__: R2BucketLike | undefined;
  var __R2_PUBLIC_BASE_URL__: string | undefined;
}

// Without a configured public base URL, refuse the R2 adapter so getStorage()
// uses local-fs and resume URLs stay valid (/uploads/...) instead of "/key".
function r2PublicBaseUrl(): string {
  const fromGlobal = globalThis.__R2_PUBLIC_BASE_URL__;
  const fromEnv = process.env.R2_PUBLIC_BASE_URL;
  const base = fromGlobal ?? fromEnv ?? "";
  return base.trim();
}

export function getCloudflareR2(): StorageLike | null {
  syncCloudflareBindings();
  const bucket = globalThis.__R2_BINDING__;
  if (!bucket) return null;

  const base = r2PublicBaseUrl();
  if (!base) return null;

  return {
    async put(key: string, data: Uint8Array, contentType: string) {
      await bucket.put(key, data, { httpMetadata: { contentType } });
      return `${base}/${key}`;
    },
  };
}
