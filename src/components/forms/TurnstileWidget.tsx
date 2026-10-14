"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Renders the Cloudflare Turnstile widget when a site key is configured
 * (see .env.example); otherwise renders nothing, and the server falls back
 * to the honeypot + timing checks in src/server/spam-guard.ts. */
export function TurnstileWidget() {
  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div className="cf-turnstile" data-sitekey={SITE_KEY} />
    </>
  );
}
