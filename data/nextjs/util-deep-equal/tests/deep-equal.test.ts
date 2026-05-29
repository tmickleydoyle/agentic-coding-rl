import { describe, it, expect } from 'vitest';
import { deepEqual } from '../lib/deep-equal';

describe('deepEqual', () => {
  it('compares primitives by value', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual(null, null)).toBe(true);
  });

  it('treats NaN as equal to NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(NaN, 0)).toBe(false);
  });

  it('compares nested objects', () => {
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
  });

  it('returns false for differing key counts', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it('compares nested arrays', () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('distinguishes arrays from objects', () => {
    expect(deepEqual([], {})).toBe(false);
    expect(deepEqual({ 0: 'a', 1: 'b' }, ['a', 'b'])).toBe(false);
  });

  it('null is not equal to an object', () => {
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });

  it('handles mixed nested structures', () => {
    const a = { list: [{ x: 1 }, { y: NaN }], n: null };
    const b = { list: [{ x: 1 }, { y: NaN }], n: null };
    expect(deepEqual(a, b)).toBe(true);
  });
});
