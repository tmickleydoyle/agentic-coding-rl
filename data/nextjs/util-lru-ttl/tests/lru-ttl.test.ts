import { describe, it, expect } from 'vitest';
import { TTLCache } from '../lib/lru-ttl';

function clock(): { now: () => number; advance: (ms: number) => void } {
  let t = 0;
  return { now: () => t, advance: (ms: number) => { t += ms; } };
}

describe('TTLCache', () => {
  it('stores and retrieves before expiry', () => {
    const c = new TTLCache<string, number>(10, 1000);
    c.set('a', 1);
    expect(c.get('a')).toBe(1);
  });

  it('returns undefined for a missing key', () => {
    const c = new TTLCache<string, number>(10, 1000);
    expect(c.get('missing')).toBeUndefined();
  });

  it('expires entries after ttl', () => {
    const ck = clock();
    const c = new TTLCache<string, number>(10, 1000, ck.now);
    c.set('a', 1);
    ck.advance(999);
    expect(c.get('a')).toBe(1);
    ck.advance(1); // now exactly ttl -> expired (>=)
    expect(c.get('a')).toBeUndefined();
  });

  it('expired entry is a miss and is removed', () => {
    const ck = clock();
    const c = new TTLCache<string, number>(10, 100, ck.now);
    c.set('a', 1);
    ck.advance(100);
    expect(c.get('a')).toBeUndefined();
    expect(c.size()).toBe(0);
  });

  it('evicts least-recently-used past capacity', () => {
    const c = new TTLCache<string, number>(2, 100000);
    c.set('a', 1);
    c.set('b', 2);
    c.set('c', 3); // evicts a
    expect(c.get('a')).toBeUndefined();
    expect(c.get('b')).toBe(2);
    expect(c.get('c')).toBe(3);
  });

  it('get refreshes recency to protect from eviction', () => {
    const c = new TTLCache<string, number>(2, 100000);
    c.set('a', 1);
    c.set('b', 2);
    c.get('a'); // a now MRU
    c.set('c', 3); // evicts b
    expect(c.get('a')).toBe(1);
    expect(c.get('b')).toBeUndefined();
    expect(c.get('c')).toBe(3);
  });

  it('get does not extend the lifetime (expiry tied to set)', () => {
    const ck = clock();
    const c = new TTLCache<string, number>(10, 1000, ck.now);
    c.set('a', 1);
    ck.advance(500);
    expect(c.get('a')).toBe(1); // refresh recency, not expiry
    ck.advance(500); // total 1000 since set -> expired
    expect(c.get('a')).toBeUndefined();
  });

  it('set on an existing key restamps the insertion time', () => {
    const ck = clock();
    const c = new TTLCache<string, number>(10, 1000, ck.now);
    c.set('a', 1);
    ck.advance(800);
    c.set('a', 2); // restamp
    ck.advance(800); // 800 since restamp, not expired
    expect(c.get('a')).toBe(2);
  });

  it('expiry is checked before capacity', () => {
    const ck = clock();
    const c = new TTLCache<number, number>(2, 100, ck.now);
    c.set(1, 1);
    c.set(2, 2);
    ck.advance(100); // both expired
    c.set(3, 3); // 1 and 2 should be purged, no eviction needed
    expect(c.size()).toBe(1);
    expect(c.get(3)).toBe(3);
    expect(c.get(1)).toBeUndefined();
  });

  it('size purges expired entries and counts only live ones', () => {
    const ck = clock();
    const c = new TTLCache<number, number>(10, 100, ck.now);
    c.set(1, 1);
    ck.advance(50);
    c.set(2, 2);
    ck.advance(60); // entry 1 is 110ms old (expired), entry 2 is 60ms (live)
    expect(c.size()).toBe(1);
  });

  it('capacity 1 keeps only the newest', () => {
    const c = new TTLCache<string, number>(1, 100000);
    c.set('a', 1);
    c.set('b', 2);
    expect(c.get('a')).toBeUndefined();
    expect(c.get('b')).toBe(2);
  });
});
