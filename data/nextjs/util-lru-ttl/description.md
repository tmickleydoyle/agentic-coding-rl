# TTL + LRU cache

Implement a `TTLCache` class in `lib/lru-ttl.ts`.

```ts
export class TTLCache<K, V> {
  constructor(capacity: number, ttlMs: number, now?: () => number);
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  size(): number;
}
```

A cache that combines time-to-live expiry with LRU eviction.

- `now` is an injectable clock returning the current time in milliseconds; it defaults
  to `Date.now`. Tests pass a manual clock.
- `set(key, value)` inserts/updates an entry and stamps it with the current time. An
  insert/update marks the key most-recently-used. After a set, if more than `capacity`
  live entries exist, evict least-recently-used entries until size is `capacity`.
- An entry is expired when `now() - insertedAt >= ttlMs` (relative to its last `set`).
  Expired entries are treated as absent.
- `get(key)` returns the value if the key exists AND is not expired; it then refreshes
  the entry's recency (LRU), but NOT its insertion time (expiry is unaffected by gets).
  If the key is missing or expired, returns `undefined` (a miss). A get that observes an
  expired entry should remove it.
- `size()` returns the number of currently LIVE (non-expired) entries; calling it must
  purge expired entries.
- Expiry is checked before capacity: an expired entry never counts toward capacity.

Export `TTLCache` as a named export.
