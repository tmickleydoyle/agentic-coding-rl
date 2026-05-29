import { describe, it, expect } from 'vitest';
import { LRUCache } from '../lib/lru-cache';

describe('LRUCache', () => {
  it('stores and retrieves values', () => {
    const c = new LRUCache<string, number>(2);
    c.put('a', 1);
    c.put('b', 2);
    expect(c.get('a')).toBe(1);
    expect(c.get('b')).toBe(2);
  });

  it('returns undefined for a missing key', () => {
    const c = new LRUCache<string, number>(2);
    expect(c.get('missing')).toBeUndefined();
  });

  it('evicts the least-recently-used entry past capacity', () => {
    const c = new LRUCache<string, number>(2);
    c.put('a', 1);
    c.put('b', 2);
    c.put('c', 3); // evicts 'a'
    expect(c.get('a')).toBeUndefined();
    expect(c.get('b')).toBe(2);
    expect(c.get('c')).toBe(3);
  });

  it('counts get as a use to protect from eviction', () => {
    const c = new LRUCache<string, number>(2);
    c.put('a', 1);
    c.put('b', 2);
    c.get('a'); // 'a' is now most-recently-used
    c.put('c', 3); // evicts 'b', not 'a'
    expect(c.get('a')).toBe(1);
    expect(c.get('b')).toBeUndefined();
    expect(c.get('c')).toBe(3);
  });

  it('updating an existing key does not evict and refreshes recency', () => {
    const c = new LRUCache<string, number>(2);
    c.put('a', 1);
    c.put('b', 2);
    c.put('a', 10); // update 'a', now most-recent
    c.put('c', 3); // evicts 'b'
    expect(c.get('a')).toBe(10);
    expect(c.get('b')).toBeUndefined();
    expect(c.get('c')).toBe(3);
  });

  it('works with capacity 1', () => {
    const c = new LRUCache<number, string>(1);
    c.put(1, 'x');
    expect(c.get(1)).toBe('x');
    c.put(2, 'y');
    expect(c.get(1)).toBeUndefined();
    expect(c.get(2)).toBe('y');
  });

  it('handles a sequence of gets and puts', () => {
    const c = new LRUCache<number, number>(3);
    c.put(1, 1);
    c.put(2, 2);
    c.put(3, 3);
    c.get(1); // 1 recent
    c.put(4, 4); // evicts 2 (lru)
    expect(c.get(2)).toBeUndefined();
    expect(c.get(1)).toBe(1);
    expect(c.get(3)).toBe(3);
    expect(c.get(4)).toBe(4);
  });
});
