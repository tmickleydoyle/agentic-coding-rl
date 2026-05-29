# LRU cache

Implement an `LRUCache` class in `lib/lru-cache.ts`.

```ts
export class LRUCache<K, V> {
  constructor(capacity: number);
  get(key: K): V | undefined;
  put(key: K, value: V): void;
}
```

Behavior:

- `put(key, value)` inserts or updates an entry. Inserting/updating marks the key
  as the most-recently-used.
- `get(key)` returns the value or `undefined` if absent. A successful `get` marks
  the key as most-recently-used.
- When the number of entries would exceed `capacity`, evict the least-recently-used
  entry (the one whose `get`/`put` was longest ago) before/after the insert so the
  size never exceeds `capacity`.
- Updating an existing key does not increase size and does not trigger eviction.

Export `LRUCache` as a named export.
