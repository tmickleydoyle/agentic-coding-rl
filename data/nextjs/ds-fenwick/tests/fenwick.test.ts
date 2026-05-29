import { describe, it, expect } from 'vitest';
import { Fenwick } from '../lib/fenwick';

// Deterministic LCG so the oracle comparison is reproducible (no Math.random).
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

describe('Fenwick', () => {
  it('all-zero tree returns zero sums', () => {
    const f = new Fenwick(5);
    expect(f.size()).toBe(5);
    expect(f.prefixSum(4)).toBe(0);
    expect(f.rangeSum(0, 4)).toBe(0);
  });

  it('point update then prefix sum', () => {
    const f = new Fenwick(5);
    f.update(2, 10);
    expect(f.prefixSum(1)).toBe(0);
    expect(f.prefixSum(2)).toBe(10);
    expect(f.prefixSum(4)).toBe(10);
  });

  it('rangeSum over a slice', () => {
    const f = Fenwick.fromArray([1, 2, 3, 4, 5]);
    expect(f.rangeSum(1, 3)).toBe(2 + 3 + 4);
    expect(f.rangeSum(0, 0)).toBe(1);
    expect(f.rangeSum(0, 4)).toBe(15);
  });

  it('fromArray matches manual prefix sums', () => {
    const arr = [3, 1, 4, 1, 5, 9, 2, 6];
    const f = Fenwick.fromArray(arr);
    let running = 0;
    for (let i = 0; i < arr.length; i++) {
      running += arr[i];
      expect(f.prefixSum(i)).toBe(running);
    }
  });

  it('fromArray does not mutate the input', () => {
    const arr = [5, 6, 7];
    Fenwick.fromArray(arr);
    expect(arr).toEqual([5, 6, 7]);
  });

  it('handles negative deltas', () => {
    const f = Fenwick.fromArray([10, 10, 10]);
    f.update(1, -4);
    expect(f.prefixSum(2)).toBe(26);
    expect(f.rangeSum(1, 1)).toBe(6);
  });

  it('clamps prefixSum index above the end and below the start', () => {
    const f = Fenwick.fromArray([2, 4, 6]);
    expect(f.prefixSum(100)).toBe(12);
    expect(f.prefixSum(-1)).toBe(0);
    expect(f.prefixSum(-50)).toBe(0);
  });

  it('rangeSum clamps and handles inverted ranges', () => {
    const f = Fenwick.fromArray([1, 2, 3, 4]);
    expect(f.rangeSum(2, 1)).toBe(0); // l > r
    expect(f.rangeSum(-5, 1)).toBe(3); // l clamped to 0
    expect(f.rangeSum(2, 100)).toBe(7); // r clamped to last
  });

  it('size 0 tree is well-behaved', () => {
    const f = new Fenwick(0);
    expect(f.size()).toBe(0);
    expect(f.prefixSum(0)).toBe(0);
    expect(f.rangeSum(0, 0)).toBe(0);
  });

  it('throws RangeError on out-of-range update', () => {
    const f = new Fenwick(3);
    expect(() => f.update(3, 1)).toThrow(RangeError);
    expect(() => f.update(-1, 1)).toThrow(RangeError);
  });

  it('throws RangeError for negative size', () => {
    expect(() => new Fenwick(-2)).toThrow(RangeError);
  });

  it('matches a brute-force oracle over a seeded op sequence', () => {
    const n = 32;
    const rng = makeRng(12345);
    const oracle = new Array<number>(n).fill(0);
    const f = new Fenwick(n);
    for (let op = 0; op < 400; op++) {
      const i = Math.floor(rng() * n);
      const delta = Math.floor(rng() * 21) - 10; // -10..10
      f.update(i, delta);
      oracle[i] += delta;

      // verify a random prefix
      const p = Math.floor(rng() * n);
      let expectedPrefix = 0;
      for (let k = 0; k <= p; k++) expectedPrefix += oracle[k];
      expect(f.prefixSum(p)).toBe(expectedPrefix);

      // verify a random range
      let l = Math.floor(rng() * n);
      let r = Math.floor(rng() * n);
      if (l > r) {
        const t = l;
        l = r;
        r = t;
      }
      let expectedRange = 0;
      for (let k = l; k <= r; k++) expectedRange += oracle[k];
      expect(f.rangeSum(l, r)).toBe(expectedRange);
    }
  });
});
