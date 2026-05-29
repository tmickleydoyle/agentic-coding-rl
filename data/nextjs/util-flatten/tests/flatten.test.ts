import { describe, it, expect } from 'vitest';
import { flatten } from '../lib/flatten';

describe('flatten', () => {
  it('fully flattens by default', () => {
    expect(flatten([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
  });

  it('flattens one level with depth 1', () => {
    expect(flatten([1, [2, [3]]], 1)).toEqual([1, 2, [3]]);
  });

  it('returns a shallow copy with depth 0', () => {
    const input = [1, [2, 3], 4];
    const out = flatten(input, 0);
    expect(out).toEqual([1, [2, 3], 4]);
    expect(out).not.toBe(input);
  });

  it('passes non-array elements through', () => {
    expect(flatten([1, 'a', null, [2]])).toEqual([1, 'a', null, 2]);
  });

  it('handles an empty array', () => {
    expect(flatten([])).toEqual([]);
  });

  it('flattens to depth 2', () => {
    expect(flatten([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
  });

  it('preserves order across mixed nesting', () => {
    expect(flatten([[1, 2], 3, [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
