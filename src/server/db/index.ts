import type { D1Like } from "./d1-like";
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

let cached: D1Like | null = null;

export function getDb(): D1Like {
  if (globalThis.__D1_BINDING__) {
    return globalThis.__D1_BINDING__;
  }

  if (cached) return cached;

  const { CF_ACCOUNT_ID, CF_D1_DATABASE_ID, CF_API_TOKEN, USE_LOCAL_DB } =
    process.env;

  const wantsRemote =
    USE_LOCAL_DB !== "true" && CF_ACCOUNT_ID && CF_D1_DATABASE_ID && CF_API_TOKEN;

  cached = wantsRemote
    ? getRemoteD1({
        accountId: CF_ACCOUNT_ID!,
        databaseId: CF_D1_DATABASE_ID!,
        apiToken: CF_API_TOKEN!,
      })
    : getLocalD1();

  return cached;
}
