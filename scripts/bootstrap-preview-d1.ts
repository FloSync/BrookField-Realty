/**
 * Prepares Wrangler's **local** D1 (miniflare) for `preview:staging`.
 *
 * OpenNext build uses `.data/local.db` during `next build`, but preview serves
 * SSR through the Worker `DB` binding backed by `.wrangler/state/v3/d1` — a
 * separate empty database unless schema and seed are applied here.
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { getPlatformProxy } from "wrangler";
import { runSeed } from "./seed";

async function main() {
  console.log("Applying D1 schema to local preview database (staging env)…");
  execSync(
    "npx wrangler d1 execute brookfield-db --local --env staging --file=./src/server/db/schema.sql",
    { stdio: "inherit" }
  );

  console.log("Seeding local preview D1 (skips non-empty tables)…");
  const { env, dispose } = await getPlatformProxy({
    configPath: "wrangler.jsonc",
    environment: "staging",
    remoteBindings: false,
  });

  // getDb() calls syncCloudflareBindings(), which reads this store (same as OpenNext).
  const contextKey = Symbol.for("__cloudflare-context__");
  (globalThis as unknown as Record<symbol, { env: typeof env }>)[contextKey] = {
    env,
  };

  try {
    await runSeed();
  } finally {
    delete (globalThis as unknown as Record<symbol, unknown>)[contextKey];
    await dispose();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
