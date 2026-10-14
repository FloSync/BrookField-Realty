# Cost notes

The brief asks that any service with recurring charges be justified before
it's introduced: why it's needed, what the free alternative is, what it
would cost, and whether it can wait. This covers the decisions made in
Phase 2.

## Database: Cloudflare D1

Used as directed. D1's free tier covers 5GB storage and 5 million row
reads / 100k row writes per day — Brookfield's property/project/team/career
catalogue (a few hundred rows at most, edited occasionally by one or two
admins) will not come close to either limit. **Cost: $0/month** at this
scale.

## Image storage: URLs in D1, not R2 — for property photos

**What was built:** `property_images` stores a URL and alt text per image;
nothing binary ever touches D1. The admin UI adds images by pasting a URL.

**Why not wire up R2 for property images:** R2's free tier (10GB storage,
no egress fees) would comfortably cover Brookfield's current image volume —
the seeded catalogue uses ~15 images across 6 properties. The missing piece
isn't capacity, it's that an upload endpoint needs a resumable/multipart
upload flow, image validation, and a public bucket + custom domain, none of
which add value while the number of images stays small and Brookfield can
host photos on any URL (their own site, a CDN, even Unsplash for
placeholders as in this seed data). Building it now would be infrastructure
ahead of an actual need.

**When to add it:** once Brookfield wants "upload a photo from my phone"
instead of "paste a URL" in the admin — i.e. a UX improvement, not a cost
or scale necessity.

## File storage: R2 for CV/resume uploads (Phase 3)

**Why this one's different:** career applications include an actual file
upload (a CV), which — unlike property photos — an applicant can't
reasonably be asked to host somewhere and paste a URL for. This is the
first genuine binary-upload requirement in the project, so it's the point
where object storage is actually justified rather than assumed.

**What was built:** a storage adapter (`src/server/storage`) mirroring the
D1 adapter pattern — a real R2 binding when deployed directly to Cloudflare
Pages/Workers (the primary path, wired in `wrangler.toml`), and a local
filesystem fallback for development that this sandbox actually exercises
and tests.

**Cost:** R2's free tier (10GB storage, **no egress fees**) covers CVs for
a long time — a few hundred applications' worth of PDFs is a few hundred
MB at most. Even past the free tier, storage is $0.015/GB-month. Realistic
cost: **$0/month** for the foreseeable future.

## Email notifications (Phase 3)

**What was evaluated:**
- **Cloudflare Email Routing** (a Worker's `send_email` binding) — free,
  no third-party account, but only available when this app is deployed
  directly to Cloudflare Pages/Workers, and only to a destination address
  verified in the Cloudflare dashboard.
- **Resend** — a REST API, free tier of 100 emails/day / 3,000/month,
  which comfortably covers Brookfield's expected enquiry volume (a
  handful of enquiries and applications per day, not per minute). Used as
  the fallback for hosting outside Cloudflare's own runtime.
- Paid transactional email platforms (SendGrid's paid tiers, Postmark,
  etc.) — not needed at this volume; would only become worth revisiting if
  Brookfield's enquiry volume grew by roughly two orders of magnitude.

**What was built:** an adapter (`src/server/email`) that tries the
Cloudflare binding first, falls back to Resend if API keys are configured,
and otherwise logs the notification to console + a local file — which is
what this sandbox actually exercises during testing, since it has no real
provider credentials or network access to either service's API.

**Cost: $0/month**, on either path, at Brookfield's expected volume.

## Spam protection (Phase 3)

**What was evaluated:** a paid CAPTCHA/anti-spam service (hCaptcha
Enterprise, Akismet, etc.) versus free options.

**What was built:** honeypot field + minimum-time-on-form check (always
on, no configuration needed, catches most automated form spam) plus an
optional **Cloudflare Turnstile** integration (free, Cloudflare's own
CAPTCHA replacement) that activates only if site/secret keys are
configured — this sandbox has no real Turnstile keys to test against, so
it's built to skip gracefully rather than block real submissions when
unconfigured.

For volumetric abuse (rate limiting), the brief also asks for protection.
The recommended mechanism is Cloudflare's own **dashboard-level rate
limiting rules** — free, zero code, effective at the edge. An in-app rate
limiter would need Workers KV or Durable Objects for state that persists
across requests (this app's process memory doesn't survive between edge
invocations), which is more infrastructure than "lightweight" justifies
here unless abuse actually becomes a problem.

**Cost: $0/month.**

## Hosting

Cloudflare Pages' free tier (unlimited requests, 500 builds/month) fits a
site this size. No paid tier is needed to launch.

## What this adds up to

At Brookfield's current and reasonably-foreseeable scale (a few hundred
properties, a handful of admins, moderate enquiry volume), the entire
stack — hosting, database, CV storage, and email notifications — runs on
free tiers: **$0/month**. The only paid line items likely to appear
eventually are R2 storage past 10GB and email past Resend's free tier,
both only relevant at a scale of growth Brookfield would be glad to have.
