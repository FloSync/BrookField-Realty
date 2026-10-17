# Production deployment (Cloudflare-first)

This app targets **Cloudflare Pages** (or Workers) with **D1**, optional **R2** (CV uploads), and optional **Email Routing** for notifications. Do **not** commit secrets. Do **not** run `db:seed` against a populated production database expecting a refresh — seed skips non-empty tables.

## 1. Create or connect D1

From the project root (with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) installed and authenticated):

```bash
npx wrangler d1 create brookfield-db
```

Copy the returned **database id** into `wrangler.toml` → `[[d1_databases]]` → `database_id` (replace `REPLACE_WITH_REAL_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE`).

For Pages, bind `DB` to this database in the Cloudflare dashboard (same name as `binding = "DB"` in `wrangler.toml`). Wire `globalThis.__D1_BINDING__` per `src/server/db/README.md` if your adapter requires it.

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
| Cloudflare Pages/Workers | D1 binding `DB`; optional R2 `RESUMES`; optional `send_email` `NOTIFY` per `wrangler.toml` |
| Other Node host | `CF_ACCOUNT_ID`, `CF_D1_DATABASE_ID`, `CF_API_TOKEN`, `USE_LOCAL_DB=false` |

## 6. Notification email

Enquiry and career notifications use `src/server/email/index.ts`:

**Option A — Cloudflare (Pages/Workers):**

1. Verify a destination address in Email Routing.
2. Set `[[send_email]]` → `destination_address` in `wrangler.toml` to that verified address.
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

```bash
npm ci
npm run build
```

Deploy the Next.js output with your Cloudflare Pages project connected to GitHub (`FloSync/BrookField-Realty`). Set all environment variables in the dashboard.

## 10. Post-deploy checks

- Public `/properties` matches published admin listings.
- `/contact` and property enquiry/inspection forms create rows in `/admin/enquiries`.
- `/admin/login` works with seeded admin credentials.
- Email notifications reach `NOTIFY_TO_EMAIL` when provider env/bindings are configured.

See also `docs/CONTENT_SYNC.md` and root `README.md`.
