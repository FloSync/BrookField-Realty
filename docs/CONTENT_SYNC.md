# Content sync: VS Code files ↔ Cloudflare D1

The **live public website** reads published rows from **Cloudflare D1** (via `src/server/db/queries/*`). The admin dashboard writes to the same database. File-based modules under `src/lib/` remain the canonical **source for bulk edits in VS Code** and for first-time seeding — they are not a second live catalogue once D1 is populated.

## What lives where

| Content | VS Code / files | Public site source | Admin CMS |
|--------|------------------|--------------------|-----------|
| Properties | `src/lib/migrated-properties.ts` (via `mock-data.ts`) | D1 `properties` + `property_images` | Yes |
| Projects | `mock-data.ts` | D1 `projects` | Yes |
| Team | `mock-data.ts` | D1 `team_members` | Yes |
| Careers | `mock-data.ts` | D1 `careers` | Yes |
| Blog | `src/lib/blog-data.ts`, `src/lib/migrated/*.json` | **Files only** | No |
| FAQs, testimonials | `mock-data.ts` | **Files only** | No |
| Marketing copy | `site-content.ts`, etc. | **Files only** | No |

Commercial vs land/house sections on `/properties` use slug rules in `src/lib/properties-page.ts` and rent exclusions via `src/lib/property-catalog-meta.ts` (rent slugs are not a D1 column yet).

Board vs staff on `/team` is inferred from job titles (`src/lib/team-groups.ts`) until an explicit `member_group` column is added.

## Workflow A — Edit in admin (recommended for day-to-day)

1. Sign in at `/admin/login`.
2. Create or edit properties, projects, team, careers.
3. Set **Published** (properties/projects/team) or **Published** status (careers).
4. Admin server actions call `revalidatePath` so ISR caches refresh within ~5 minutes (`revalidate = 300` on public pages).

## Workflow B — Edit in VS Code, then sync to D1

Use this when you prefer editing the catalogue in git-tracked TypeScript.

1. Edit `migrated-properties.ts` and/or arrays in `mock-data.ts`.
2. **Only on an empty table** (local dev or new environment), run:
   ```bash
   npm run db:seed
   ```
   The seed script **skips** any table that already has rows — it will **not** overwrite production data.
3. For an environment that already has D1 data, either:
   - Apply the same changes through `/admin`, or
   - Use one-off SQL/`wrangler d1 execute` updates (not automated in this repo).

After syncing, run `npm run build` locally to verify slugs and images still resolve.

## Local development

1. Copy `.env.example` → `.env.local` and set `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Ensure schema is applied to `.data/local.db` (see `docs/DEPLOYMENT.md`).
3. Run `npm run db:seed` once if tables are empty.
4. `npm run dev` — public pages and admin share the same local SQLite file.

## Homepage “Latest properties” order

Slugs are fixed in `src/lib/property-catalog-meta.ts` (`HOME_LATEST_PROPERTY_SLUGS`). Those listings must be **published** in D1 to appear on the homepage.
