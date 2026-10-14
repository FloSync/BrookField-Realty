# Wiring a real Cloudflare D1 binding

`src/server/db/index.ts` picks its backend in this order:

1. `globalThis.__D1_BINDING__` — a real D1 binding, if one has been set
2. the Cloudflare D1 REST API adapter, if `CF_ACCOUNT_ID` / `CF_D1_DATABASE_ID` / `CF_API_TOKEN` are set
3. the local SQLite adapter (dev default)

If this app is deployed directly to Cloudflare Pages Functions or Workers
(rather than hosted elsewhere and talking to D1 over HTTP), Cloudflare
injects the D1 binding onto the request's `env` object, not onto
`process.env`. The adapter used by every query function in
`src/server/db/queries/*` never changes — only where the binding comes from
does. The usual place to bridge the two is the platform's request-context
entrypoint (varies by adapter: `@cloudflare/next-on-pages`, OpenNext's
Cloudflare adapter, etc.), where you'd set:

```ts
globalThis.__D1_BINDING__ = env.DB;
```

once per request, before any query function runs. This repo doesn't pin a
specific Cloudflare/Next.js adapter, since that choice depends on which one
is current when Brookfield actually deploys — but the query layer
underneath is already written against the same `D1Like` interface a real
binding implements, so no query code needs to change either way.
