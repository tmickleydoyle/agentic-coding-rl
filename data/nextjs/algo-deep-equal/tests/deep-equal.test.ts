import { describe, it, expect } from 'vitest';
import { deepEqual } from '../reference/lib/deep-equal';

describe('deepEqual', () => {
  it('returns true for identical primitives', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual('a', 'b')).toBe(false);
    expect(deepEqual(true, false)).toBe(false);
  });

  it('handles null and undefined', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(null, {})).toBe(false);
  });

  it('returns true for NaN compared to NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it('compares empty arrays', () => {
    expect(deepEqual([], [])).toBe(true);
  });

  it('compares arrays with same elements', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for arrays with different lengths', () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('returns false for arrays with different elements', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('compares empty objects', () => {
    expect(deepEqual({}, {})).toBe(true);
  });

  it('compares plain objects deeply', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('compares nested structures', () => {
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);
    expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 3] } })).toBe(false);
  });

  it('returns false when array compared to object', () => {
    expect(deepEqual([], {})).toBe(false);
  });
});
