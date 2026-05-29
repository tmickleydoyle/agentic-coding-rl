import { describe, it, expect } from 'vitest';
import { binarySearch } from '../lib/binary-search';

describe('binarySearch', () => {
  it('returns -1 for an empty array', () => {
    expect(binarySearch([], 5)).toBe(-1);
  });

  it('finds the element in a single-element array', () => {
    expect(binarySearch([7], 7)).toBe(0);
    expect(binarySearch([7], 8)).toBe(-1);
  });

  it('finds an element in the middle', () => {
    const arr = [1, 3, 5, 7, 9];
    expect(binarySearch(arr, 5)).toBe(2);
  });

  it('finds elements at both ends', () => {
    const arr = [1, 3, 5, 7, 9];
    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 9)).toBe(4);
  });

  it('returns -1 for an absent target', () => {
    const arr = [1, 3, 5, 7, 9];
    expect(binarySearch(arr, 4)).toBe(-1);
    expect(binarySearch(arr, 0)).toBe(-1);
    expect(binarySearch(arr, 100)).toBe(-1);
  });

  it('returns a valid index for duplicates', () => {
    const arr = [1, 2, 2, 2, 3];
    const idx = binarySearch(arr, 2);
    expect(arr[idx]).toBe(2);
    expect(idx).toBeGreaterThanOrEqual(1);
    expect(idx).toBeLessThanOrEqual(3);
  });

  it('works on a larger array', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i * 2);
    expect(binarySearch(arr, 500)).toBe(250);
    expect(binarySearch(arr, 501)).toBe(-1);
  });
});
