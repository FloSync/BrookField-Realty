import type { D1Like, D1PreparedLike, D1RunResult } from "./d1-like";

// Cloudflare exposes D1 over a plain HTTPS query endpoint, documented at
// https://developers.cloudflare.com/api/operations/cloudflare-d1-query-database
// This lets a normal Node server (not just a Cloudflare Worker) read and
// write D1 without a Workers deployment in between.
//
// If this app is instead deployed directly to Cloudflare Pages Functions /
// Workers, use the real `env.DB` binding there — it already implements
// D1Like natively and skips this HTTP round trip entirely. This adapter
// exists for any other hosting target.

interface CloudflareD1QueryResponse {
  success: boolean;
  errors: { message: string }[];
  result: {
    results: unknown[];
    success: boolean;
    meta: { last_row_id?: number; changes?: number };
  }[];
}

class RemotePrepared implements D1PreparedLike {
  constructor(
    private accountId: string,
    private databaseId: string,
    private apiToken: string,
    private sql: string,
    private values: unknown[] = []
  ) {}

  bind(...values: unknown[]): D1PreparedLike {
    return new RemotePrepared(
      this.accountId,
      this.databaseId,
      this.apiToken,
      this.sql,
      values
    );
  }

  private async execute(): Promise<CloudflareD1QueryResponse["result"][number]> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql: this.sql, params: this.values }),
    });

    if (!res.ok) {
      throw new Error(`D1 query failed with status ${res.status}`);
    }

    const data = (await res.json()) as CloudflareD1QueryResponse;
    if (!data.success) {
      const message = data.errors?.[0]?.message ?? "Unknown D1 error";
      throw new Error(`D1 query failed: ${message}`);
    }
    return data.result[0];
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    const result = await this.execute();
    return { results: result.results as T[] };
  }

  async first<T = unknown>(): Promise<T | null> {
    const result = await this.execute();
    return (result.results[0] as T) ?? null;
  }

  async run(): Promise<D1RunResult> {
    const result = await this.execute();
    return { success: result.success, meta: result.meta };
  }
}

export function getRemoteD1(config: {
  accountId: string;
  databaseId: string;
  apiToken: string;
}): D1Like {
  return {
    prepare(sql: string) {
      return new RemotePrepared(
        config.accountId,
        config.databaseId,
        config.apiToken,
        sql
      );
    },
  };
}
