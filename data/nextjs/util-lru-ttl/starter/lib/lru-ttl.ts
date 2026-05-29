export class TTLCache<K, V> {
  constructor(capacity: number, ttlMs: number, now?: () => number) {
    // TODO: implement
    void capacity;
    void ttlMs;
    void now;
  }

  get(key: K): V | undefined {
    // TODO: implement
    void key;
    throw new Error('not implemented');
  }

  set(key: K, value: V): void {
    // TODO: implement
    void key;
    void value;
    throw new Error('not implemented');
  }

  size(): number {
    // TODO: implement
    throw new Error('not implemented');
  }
}
