import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import type { D1Like, D1PreparedLike, D1RunResult } from "./d1-like";

// D1 is SQLite under the hood, so developing against a real local SQLite
// file is a faithful stand-in — not a mock. The schema file below is the
// exact migration that would be applied to the real D1 database.

let instance: DatabaseSync | null = null;

function getFilePath(): string {
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "local.db");
}

function getDatabase(): DatabaseSync {
  if (instance) return instance;
  const file = getFilePath();
  const isNew = !fs.existsSync(file);
  instance = new DatabaseSync(file);
  instance.exec("PRAGMA foreign_keys = ON;");
  if (isNew) {
    const schema = fs.readFileSync(
      path.join(process.cwd(), "src/server/db/schema.sql"),
      "utf-8"
    );
    instance.exec(schema);
  }
  return instance;
}

class LocalPrepared implements D1PreparedLike {
  constructor(
    private db: DatabaseSync,
    private sql: string,
    private values: unknown[] = []
  ) {}

  bind(...values: unknown[]): D1PreparedLike {
    return new LocalPrepared(this.db, this.sql, values);
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    const stmt = this.db.prepare(this.sql);
    const results = stmt.all(...(this.values as never[])) as T[];
    return { results };
  }

  async first<T = unknown>(): Promise<T | null> {
    const stmt = this.db.prepare(this.sql);
    const row = stmt.get(...(this.values as never[])) as T | undefined;
    return row ?? null;
  }

  async run(): Promise<D1RunResult> {
    const stmt = this.db.prepare(this.sql);
    const info = stmt.run(...(this.values as never[]));
    return {
      success: true,
      meta: {
        last_row_id: Number(info.lastInsertRowid),
        changes: Number(info.changes),
      },
    };
  }
}

export function getLocalD1(): D1Like {
  const db = getDatabase();
  return {
    prepare(sql: string) {
      return new LocalPrepared(db, sql);
    },
    async batch(statements: D1PreparedLike[]) {
      const results: D1RunResult[] = [];
      for (const stmt of statements) {
        results.push(await stmt.run());
      }
      return results;
    },
  };
}

/** Test-only helper: wipes and recreates the local database file. */
export function resetLocalD1(): void {
  instance = null;
  const file = getFilePath();
  if (fs.existsSync(file)) fs.rmSync(file);
}
