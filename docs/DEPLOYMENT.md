# Production deployment (Cloudflare-first)

This app targets **Cloudflare Workers** via [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) (see root `package.json` scripts), with **D1**, **R2** (CV uploads and OpenNext cache), **Email Routing** for notifications, and optional **Images** binding. Binding names and bucket/database placeholders live in **`wrangler.jsonc`** at the project root (top-level = default worker; `env.staging` = staging worker). Do **not** commit secrets. Do **not** run `db:seed` against a populated production database expecting a refresh — seed skips non-empty tables.

## Local dev vs Cloudflare bindings

- **`USE_LOCAL_DB=true`** — Forces SQLite at `.data/local.db` for reads/writes (`getDb()`). It does **not** guarantee local-only R2 or email: worker bindings from OpenNext preview/dev (`RESUMES`, `NOTIFY`) or env vars (`R2_PUBLIC_BASE_URL`, Resend keys) can still route CV uploads or notifications to remote services.
- **Avoid accidental remote CV uploads** when developing locally: set `USE_LOCAL_DB=true`, **do not** set `R2_PUBLIC_BASE_URL` in `.env.local` if you want filesystem uploads under `public/uploads/`, and do not run `preview:staging` / `deploy:staging` until staging R2 and URLs are intentionally configured. If a prior session left binding globals set, restart dev or run without Wrangler remote bindings in context.

## Staging worker (OpenNext)

Scripts (require verified Cloudflare resources first — see checklist below):

| Script | Purpose |
|--------|---------|
| `npm run preview:staging` | `opennextjs-cloudflare build` then local preview with `--env staging` |
| `npm run deploy:staging` | Build and deploy worker `brookfield-realty-staging` |
| `npm run upload:staging` | Build and upload worker bundle without a full deploy |

**Do not run `preview:staging` or `deploy:staging` until** you have verified in the Cloudflare dashboard (or `wrangler` CLI) and updated `wrangler.jsonc` → `env.staging`:

1. **D1** — Real staging `database_id` (replace `STAGING_DATABASE_ID_UNVERIFIED`); schema applied to that database.
2. **Email** — Verified destination for `send_email` → `NOTIFY` (`destination_address` placeholder replaced).
3. **R2** — Staging buckets exist for `NEXT_INC_CACHE_R2_BUCKET` and `RESUMES` (`brookfield-opennext-cache-staging`, `brookfield-resumes-staging` or names you chose and wired in config).
4. **`R2_PUBLIC_BASE_URL`** — Set in the staging worker environment (dashboard or Wrangler vars) to the public base URL for resume objects **after** the staging `RESUMES` bucket and public access (custom domain or `r2.dev`) are confirmed. Do not invent URLs in git.

Until those are real, use `npm run dev` with local SQLite and local uploads only.

## 1. Create or connect D1

From the project root (with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed and authenticated):

```bash
npx wrangler d1 create brookfield-db
```

Copy the returned **database id** into `wrangler.jsonc` → `d1_databases` → `database_id` (replace `REPLACE_WITH_REAL_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE`). For staging, create or list a separate D1 and set `env.staging.d1_databases[0].database_id`.

On Workers, bindings are declared in `wrangler.jsonc`; OpenNext syncs them at runtime per `src/server/cloudflare/sync-bindings.ts`. See `src/server/db/README.md` for adapter details.

**Alternative host (Node/Vercel):** set `USE_LOCAL_DB=false` and provide `CF_ACCOUNT_ID`, `CF_D1_DATABASE_ID`, and `CF_API_TOKEN` with a token scoped to D1 read/write.

## 2. Apply schema (safe for existing DB)

Schema uses `CREATE TABLE IF NOT EXISTS` only — re-running does not drop data.

**Remote (production):**

```bash
npx wrangler d1 execute brookfield-db --remote --file=./src/server/db/schema.sql
```

**Local:**

```bash
npx wrangler d1 execute brookfield-db --local --file=./src/server/db/schema.sql
```

Do not run destructive SQL or `npm run db:reset` against production.

## 3. Initial content and administrator

### Content

- **Empty production D1:** run `npm run db:seed` once from a trusted machine with env pointing at production (remote D1 credentials), **or** enter content via `/admin` after creating an admin.
- **Existing production D1:** use admin only; seed will skip tables that already contain rows.

### Administrator account

Seed creates the first admin **only when** the `admins` table is empty **and** both are set:

- `ADMIN_EMAIL` — login email (not the public `contact@brookfieldrealtyltd.com` unless you choose that)
- `ADMIN_PASSWORD` — strong password; never commit

```bash
# Example (local); use your host's secret store in production
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run db:seed
```

To add admins later, use a one-off script or SQL insert with bcrypt hash — not included in this repo.

## 4. Session secret

Generate a long random value (e.g. `openssl rand -base64 48`) and set in the deployment environment:

- `SESSION_SECRET` — signs admin session cookies (`src/server/auth/session.ts`, `src/proxy.ts`)

Required for `/admin` access in production.

## 5. Database bindings summary

| Deployment | Configuration |
|------------|----------------|
| Cloudflare Workers (OpenNext) | D1 `DB`; R2 `NEXT_INC_CACHE_R2_BUCKET`, `RESUMES`; `send_email` `NOTIFY`; `images` `IMAGES` per `wrangler.jsonc` |
| Other Node host | `CF_ACCOUNT_ID`, `CF_D1_DATABASE_ID`, `CF_API_TOKEN`, `USE_LOCAL_DB=false` |

## 6. Notification email

Enquiry and career notifications use `src/server/email/index.ts`:

**Option A — Cloudflare Workers:**

1. Verify a destination address in Email Routing.
2. Set `send_email` → `destination_address` in `wrangler.jsonc` (and `env.staging` for staging) to that verified address.
3. Deploy with the `NOTIFY` binding wired per `src/server/email/cloudflare-email.ts`.

**Option B — Resend (any host):**

Set in environment (values are yours — not stored in git):

- `RESEND_API_KEY`
- `NOTIFY_FROM_EMAIL` — sender verified in Resend
- `NOTIFY_TO_EMAIL` — **`contact@brookfieldrealtyltd.com`** (company inbox)

Without either option, submissions are still stored in D1; email falls back to console / dev log only.

## 7. Turnstile (recommended)

Optional but recommended for public forms:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If unset, Turnstile is skipped; honeypot and timing checks still apply (`src/server/spam-guard.ts`).

## 8. R2 for CV uploads (careers)

See `src/server/storage/README.md`. Configure `RESUMES` bucket binding on Cloudflare or local filesystem fallback for dev.

## 9. Build and deploy

**Local Next.js build (no Workers deploy):**

```bash
npm ci
npm run build
```

**Staging (after checklist above):**

```bash
npm run deploy:staging
```

Set worker secrets and vars (e.g. `SESSION_SECRET`, Turnstile keys, `R2_PUBLIC_BASE_URL`) in the Cloudflare dashboard or via Wrangler for the staging worker. Production deploy uses the top-level `wrangler.jsonc` worker name `brookfield-realty` once placeholders there are replaced and resources exist.

## 10. Post-deploy checks

- Public `/properties` matches published admin listings.
- `/contact` and property enquiry/inspection forms create rows in `/admin/enquiries`.
- `/admin/login` works with seeded admin credentials.
- Email notifications reach `NOTIFY_TO_EMAIL` when provider env/bindings are configured.

See also `docs/CONTENT_SYNC.md` and root `README.md`.
