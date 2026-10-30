// Same reasoning as D1Like (see src/server/db/d1-like.ts): this interface
// matches Cloudflare R2's own bucket API shape closely enough that a real
// R2Bucket binding satisfies it directly, so query/action code never needs
// to know which backend is in use.

export interface StoredObject {
  data: Uint8Array;
  contentType: string;
}

export interface StorageLike {
  /** Stores a file and returns the storage key (not a public URL). */
  put(key: string, data: Uint8Array, contentType: string): Promise<string>;
  /** Loads a previously stored object by key, or null if missing. */
  get(key: string): Promise<StoredObject | null>;
}
