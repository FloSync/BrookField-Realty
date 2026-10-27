# Wiring a real Cloudflare R2 binding

Same pattern as `src/server/db/README.md` for D1. `src/server/storage/index.ts`
checks `globalThis.__R2_BINDING__` first; if unset, it falls back to writing
files under `.data/resumes` locally (not web-accessible).

CVs are private: `put()` returns the object key stored in D1 as
`resume_storage_key`. Admins download via `/api/admin/applications/[id]/resume`
(session required). Do not enable public R2 access or set `R2_PUBLIC_BASE_URL`
for resumes.

If deployed directly to Cloudflare Pages Functions/Workers, bridge the real
binding once per request before any upload runs (OpenNext does this via
`syncCloudflareBindings()`):

```ts
globalThis.__R2_BINDING__ = env.RESUMES;
```

`wrangler.jsonc` declares the `RESUMES` bucket binding for local
`wrangler r2` commands and for a direct Workers/Pages deployment.

No REST API fallback is implemented for hosting outside Cloudflare's own
runtime — see the comment in `src/server/storage/cloudflare-r2.ts` for why,
and the `aws4fetch`-based path to add one if it's ever needed.
