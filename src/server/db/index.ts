import type { D1Like } from "./d1-like";
import { syncCloudflareBindings } from "../cloudflare/sync-bindings";
import { getLocalD1 } from "./local-sqlite";
import { getRemoteD1 } from "./cloudflare-d1";

// Real Cloudflare Pages/Workers deployments inject the D1 binding onto the
// request's `env` object, not onto Node's `process.env`. If this app is
// deployed with the Cloudflare adapter, `globalThis.__D1_BINDING__` is set
// per-request before these query functions run; see
// src/server/db/README.md for the wiring notes.
declare global {
  var __D1_BINDING__: D1Like | undefined;
}

/** Cached REST or local SQLite adapter — never used when a Worker D1 binding is active. */
let cachedFallback: D1Like | null = null;

export function getDb(): D1Like {
  syncCloudflareBindings();

  if (globalThis.__D1_BINDING__) {
    return globalThis.__D1_BINDING__;
  }

  if (cachedFallback) return cachedFallback;

  const { CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN, USE_LOCAL_DB } =
    process.env;

  const wantsRemote =
    USE_LOCAL_DB !== "true" && CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_TOKEN;

  cachedFallback = wantsRemote
    ? getRemoteD1({
        accountId: CF_ACCOUNT_ID!,
        databaseId: CF_D1_DATABASE_ID!,
        apiToken: CF_API_TOKEN!,
      })
    : getLocalD1();

  return cachedFallback;
}
