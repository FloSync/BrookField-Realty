# Brookfield Realty & Investment Ltd. — website

Next.js (App Router, TypeScript, Tailwind v4) site with a Cloudflare
D1-backed content layer, an admin CMS, and a lead-generation/enquiry system
(enquiries, inspection requests, career applications, WhatsApp/phone/email
CTAs). See `COST_NOTES.md` for the infrastructure cost reasoning,
`src/server/db/README.md` for how D1 is wired for production, and
`src/server/storage/README.md` for the same on R2 (used for CV uploads).

## Local setup

```bash
npm install
cp .env.example .env.local   # then set SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:seed              # creates the admin account + sample content
npm run dev
```

Local development uses a SQLite file at `.data/local.db` — schema-identical
to Cloudflare D1 (see `src/server/db/schema.sql`), so what works locally
works against real D1 unchanged. Delete `.data/` (or run `npm run db:reset`)
to start over. CV uploads land in `public/uploads/` locally (see
`src/server/storage`); enquiry/application email notifications, absent real
provider credentials, are logged to `.data/notifications.log` instead of
sent (see `src/server/email`).

Visit `/admin/login` with the email/password you set in `.env.local`.

## Scripts

- `npm run dev` / `npm run build` / `npm run start` — standard Next.js
- `npm run lint` — ESLint
- `npm run db:seed` — create the admin account and load sample content
- `npm run db:reset` — wipe the local database file
- `python3 scripts/e2e_test.py` — exercises the enquiry, inspection, and
  career application flows against a running `next start` server on
  `localhost:3000`; used during Phase 3 development to verify submissions
  actually save, notify, and show up in the admin views

## Structure

- `src/app/(public pages)` — the public site, reading from the database
- `src/app/admin/(dashboard)` — the admin CMS (properties, projects, team,
  careers, enquiries, applications), protected by `src/proxy.ts`
- `src/server/db` — the D1 adapter layer and query functions
- `src/server/storage` — the R2 adapter layer (CV uploads)
- `src/server/email` — the notification email adapter layer
- `src/server/actions` — server actions backing every admin mutation and
  public form submission
- `src/server/auth` — session cookies and password hashing
- `src/server/spam-guard.ts` — honeypot/timing/Turnstile checks for public
  forms
- `scripts/seed.ts` — seed script

## Deploying

See `src/server/db/README.md` for wiring a real D1 binding and
`src/server/storage/README.md` for R2, if deploying directly to Cloudflare
Pages/Workers — the primary supported path, since it's also the only way
to get free enquiry-notification emails (Cloudflare Email Routing). For
other hosts, set `CF_ACCOUNT_ID` / `CF_D1_DATABASE_ID` / `CF_API_TOKEN` for
D1 over REST, and `RESEND_API_KEY` / `NOTIFY_FROM_EMAIL` / `NOTIFY_TO_EMAIL`
for email via Resend. `wrangler.toml` has the D1/R2/email binding config.
