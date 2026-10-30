import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Like } from "../db/d1-like";

/**
 * Bridges OpenNext / Workers `env` bindings onto the `globalThis` hooks used by
 * `getDb()`, `getCloudflareR2()`, and `getCloudflareEmailSender()`.
 *
 * Resolution order for bindings (DB, RESUMES, NOTIFY):
 * 1. `globalThis[Symbol.for("__cloudflare-context__")]?.env` (OpenNext ALS store)
 * 2. `@opennextjs/cloudflare` `getCloudflareContext({ async: false })` when the
 *    symbol store is empty but the helper succeeds (same underlying store in prod)
 *
 * When no Cloudflare request context exists (typical `next dev` without the
 * OpenNext dev integration), worker binding globals are cleared so stale values
 * from a prior request cannot leak; SQLite / REST / local-fs fallbacks then apply.
 *
 * When a context exists, each binding global is set from the matching `env` key
 * or cleared if that key is absent for this request.
 *
 * `USE_LOCAL_DB=true` clears `__D1_BINDING__` after env sync so local SQLite wins
 * even when the OpenNext dev proxy injects a D1 binding.
 *
 * Email from/to and the public R2 base URL are taken only from `process.env`
 * (`NOTIFY_FROM_EMAIL`, `NOTIFY_TO_EMAIL`, `R2_PUBLIC_BASE_URL`) and are never
 * invented here.
 */

const CLOUDFLARE_CONTEXT_SYMBOL = Symbol.for("__cloudflare-context__");

/** Bindings declared in wrangler.jsonc for this app (names only; types are minimal). */
interface BrookfieldWorkerEnv {
  DB?: D1Like;
  RESUMES?: {
    put(
      key: string,
      data: Uint8Array,
      options?: { httpMetadata?: { contentType?: string } },
    ): Promise<unknown>;
    get(key: string): Promise<{
      arrayBuffer(): Promise<ArrayBuffer>;
      httpMetadata?: { contentType?: string };
    } | null>;
  };
  NOTIFY?: { send(message: unknown): Promise<void> };
}

type CloudflareContextStore = { env?: BrookfieldWorkerEnv };

function readWorkerEnv(): BrookfieldWorkerEnv | undefined {
  const fromSymbol = (
    globalThis as unknown as Record<symbol, CloudflareContextStore | undefined>
  )[CLOUDFLARE_CONTEXT_SYMBOL];
  if (fromSymbol?.env) {
    return fromSymbol.env;
  }

  try {
    return getCloudflareContext({ async: false }).env as BrookfieldWorkerEnv;
  } catch {
    return undefined;
  }
}

function clearWorkerBindingGlobals(): void {
  globalThis.__D1_BINDING__ = undefined;
  globalThis.__R2_BINDING__ = undefined;
  globalThis.__EMAIL_BINDING__ = undefined;
}

function assignProcessEnvGlobals(): void {
  const { NOTIFY_FROM_EMAIL, NOTIFY_TO_EMAIL, R2_PUBLIC_BASE_URL } = process.env;
  if (NOTIFY_FROM_EMAIL !== undefined && NOTIFY_FROM_EMAIL !== "") {
    globalThis.__EMAIL_FROM__ = NOTIFY_FROM_EMAIL;
  }
  if (NOTIFY_TO_EMAIL !== undefined && NOTIFY_TO_EMAIL !== "") {
    globalThis.__EMAIL_TO__ = NOTIFY_TO_EMAIL;
  }
  if (R2_PUBLIC_BASE_URL !== undefined && R2_PUBLIC_BASE_URL !== "") {
    globalThis.__R2_PUBLIC_BASE_URL__ = R2_PUBLIC_BASE_URL;
  }
}

function syncBindingFromEnv<T>(
  present: T | undefined,
  assign: (value: T) => void,
  clear: () => void,
): void {
  if (present) {
    assign(present);
  } else {
    clear();
  }
}

export function syncCloudflareBindings(): void {
  assignProcessEnvGlobals();

  const env = readWorkerEnv();
  if (!env) {
    clearWorkerBindingGlobals();
    return;
  }

  const useLocalDb = process.env.USE_LOCAL_DB === "true";

  if (useLocalDb) {
    globalThis.__D1_BINDING__ = undefined;
  } else {
    syncBindingFromEnv(
      env.DB,
      (db) => {
        globalThis.__D1_BINDING__ = db;
      },
      () => {
        globalThis.__D1_BINDING__ = undefined;
      },
    );
  }

  syncBindingFromEnv(
    env.RESUMES,
    (bucket) => {
      globalThis.__R2_BINDING__ = bucket;
    },
    () => {
      globalThis.__R2_BINDING__ = undefined;
    },
  );

  syncBindingFromEnv(
    env.NOTIFY,
    (sender) => {
      globalThis.__EMAIL_BINDING__ = sender;
    },
    () => {
      globalThis.__EMAIL_BINDING__ = undefined;
    },
  );
}

declare global {
  var __D1_BINDING__: D1Like | undefined;
  var __R2_BINDING__:
    | {
        put(
          key: string,
          data: Uint8Array,
          options?: { httpMetadata?: { contentType?: string } },
        ): Promise<unknown>;
        get(key: string): Promise<{
          arrayBuffer(): Promise<ArrayBuffer>;
          httpMetadata?: { contentType?: string };
        } | null>;
      }
    | undefined;
  var __R2_PUBLIC_BASE_URL__: string | undefined;
  var __EMAIL_BINDING__: { send(message: unknown): Promise<void> } | undefined;
  var __EMAIL_FROM__: string | undefined;
  var __EMAIL_TO__: string | undefined;
}

