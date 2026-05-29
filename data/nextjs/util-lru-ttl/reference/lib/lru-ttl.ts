interface Entry<V> {
  value: V;
  insertedAt: number;
}

export class TTLCache<K, V> {
  private capacity: number;
  private ttlMs: number;
  private now: () => number;
  // Map preserves insertion order; we use it as the recency list (oldest = LRU front).
  private map: Map<K, Entry<V>>;

  constructor(capacity: number, ttlMs: number, now: () => number = Date.now) {
    this.capacity = capacity;
    this.ttlMs = ttlMs;
    this.now = now;
    this.map = new Map<K, Entry<V>>();
  }

  private isExpired(e: Entry<V>): boolean {
    return this.now() - e.insertedAt >= this.ttlMs;
  }

  private purgeExpired(): void {
    const dead: K[] = [];
    this.map.forEach((e, k) => {
      if (this.isExpired(e)) dead.push(k);
    });
    for (let i = 0; i < dead.length; i++) {
      this.map.delete(dead[i]);
    }
  }

  get(key: K): V | undefined {
    const e = this.map.get(key);
    if (e === undefined) return undefined;
    if (this.isExpired(e)) {
      this.map.delete(key);
      return undefined;
    }
    // refresh recency only (not insertion time)
    this.map.delete(key);
    this.map.set(key, e);
    return e.value;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    }
    this.map.set(key, { value, insertedAt: this.now() });
    // expiry takes precedence over capacity: drop expired before evicting LRU
    this.purgeExpired();
    while (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value as K;
      this.map.delete(oldest);
    }
  }

  size(): number {
    this.purgeExpired();
    return this.map.size;
  }
}
