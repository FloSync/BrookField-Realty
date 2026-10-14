// Three layers, cheapest and least intrusive first:
//   1. Honeypot field — invisible to real visitors, bots often fill every
//      input they find.
//   2. Minimum time-on-form — a hidden timestamp set when the form renders;
//      submissions faster than a human could plausibly type are rejected.
//   3. Cloudflare Turnstile — only enforced if site/secret keys are
//      configured (see .env.example), since this sandbox has no real keys
//      to test against. Recommended for production.
//
// For volumetric abuse (the same visitor hammering the endpoint), the
// brief also asks for rate limiting. The right place for that is
// Cloudflare's own dashboard-level rate limiting rules — free, zero code,
// and effective at the edge before a request even reaches this app. An
// in-app rate limiter would need Workers KV or Durable Objects for
// cross-request state (this app's own process memory doesn't persist
// across edge invocations), which is more infrastructure than a "lightweight"
// defense justifies here — see COST_NOTES.md.

const MIN_SECONDS_ON_FORM = 2;

export interface SpamCheckResult {
  passed: boolean;
  reason?: string;
}

export function checkHoneypotAndTiming(formData: FormData): SpamCheckResult {
  const honeypot = formData.get("website"); // deliberately named like a real field
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { passed: false, reason: "honeypot" };
  }

  const renderedAt = Number(formData.get("renderedAt"));
  if (!renderedAt || Number.isNaN(renderedAt)) {
    return { passed: false, reason: "missing-timestamp" };
  }
  const elapsedSeconds = (Date.now() - renderedAt) / 1000;
  if (elapsedSeconds < MIN_SECONDS_ON_FORM) {
    return { passed: false, reason: "too-fast" };
  }

  return { passed: true };
}

export async function verifyTurnstile(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Not configured in this environment — skip rather than block every
    // submission. See .env.example.
    return true;
  }
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}
