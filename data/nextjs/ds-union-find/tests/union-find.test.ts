import { describe, it, expect } from 'vitest';
import { DSU } from '../lib/union-find';

describe('DSU', () => {
  it('starts with n singleton components', () => {
    const d = new DSU(5);
    expect(d.count()).toBe(5);
    expect(d.connected(0, 1)).toBe(false);
    expect(d.find(3)).toBe(3);
  });

  it('handles n = 0', () => {
    const d = new DSU(0);
    expect(d.count()).toBe(0);
  });

  it('union merges two components and returns true', () => {
    const d = new DSU(4);
    expect(d.union(0, 1)).toBe(true);
    expect(d.connected(0, 1)).toBe(true);
    expect(d.count()).toBe(3);
  });

  it('union of already-connected elements is idempotent', () => {
    const d = new DSU(3);
    expect(d.union(0, 1)).toBe(true);
    expect(d.union(1, 0)).toBe(false);
    expect(d.union(0, 1)).toBe(false);
    expect(d.count()).toBe(2);
  });

  it('union is transitive', () => {
    const d = new DSU(4);
    d.union(0, 1);
    d.union(1, 2);
    expect(d.connected(0, 2)).toBe(true);
    expect(d.connected(0, 3)).toBe(false);
    expect(d.count()).toBe(2);
  });

  it('find returns a consistent representative for a set', () => {
    const d = new DSU(5);
    d.union(0, 1);
    d.union(2, 3);
    d.union(1, 3);
    const r = d.find(0);
    expect(d.find(1)).toBe(r);
    expect(d.find(2)).toBe(r);
    expect(d.find(3)).toBe(r);
    expect(d.find(4)).not.toBe(r);
  });

  it('merging all elements yields a single component', () => {
    const d = new DSU(6);
    for (let i = 1; i < 6; i++) d.union(0, i);
    expect(d.count()).toBe(1);
    for (let i = 0; i < 6; i++) {
      expect(d.connected(i, (i + 1) % 6)).toBe(true);
    }
  });

  it('separate clusters stay distinct', () => {
    const d = new DSU(6);
    d.union(0, 1);
    d.union(1, 2);
    d.union(3, 4);
    expect(d.count()).toBe(3);
    expect(d.connected(2, 3)).toBe(false);
    expect(d.connected(4, 5)).toBe(false);
    expect(d.connected(3, 4)).toBe(true);
  });

  it('path compression keeps find correct after deep chains', () => {
    const d = new DSU(10);
    for (let i = 0; i < 9; i++) d.union(i, i + 1);
    const r = d.find(9);
    for (let i = 0; i < 10; i++) expect(d.find(i)).toBe(r);
    expect(d.count()).toBe(1);
  });

  it('throws RangeError for out-of-range indices', () => {
    const d = new DSU(3);
    expect(() => d.find(3)).toThrow(RangeError);
    expect(() => d.find(-1)).toThrow(RangeError);
    expect(() => d.union(0, 5)).toThrow(RangeError);
    expect(() => d.connected(0, -1)).toThrow(RangeError);
  });

  it('throws RangeError for negative n', () => {
    expect(() => new DSU(-1)).toThrow(RangeError);
  });
});
