// This interface intentionally mirrors Cloudflare's real D1Database binding
// shape (prepare -> bind -> all/first/run). That means:
//   - the local-sqlite adapter (used in dev, and in this sandbox for testing)
//   - the REST-API adapter (used when Next.js runs outside Cloudflare's own
//     Workers/Pages runtime)
//   - a real `env.DB` D1 binding (used when deployed to Cloudflare Pages
//     Functions / Workers directly)
// are all interchangeable. Query functions in src/server/db/queries only
// ever depend on this interface, never on which backend is in use.

export interface D1Like {
  prepare(sql: string): D1PreparedLike;
  batch?(statements: D1PreparedLike[]): Promise<D1RunResult[]>;
}

export interface D1PreparedLike {
  bind(...values: unknown[]): D1PreparedLike;
  all<T = unknown>(): Promise<{ results: T[] }>;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1RunResult>;
}

export interface D1RunResult {
  success: boolean;
  meta: {
    last_row_id?: number;
    changes?: number;
  };
}
