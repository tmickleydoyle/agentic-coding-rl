import { describe, it, expect } from 'vitest';
import { binarySearch, lowerBound, upperBound, countOccurrences } from '../reference/lib/binary-search';

describe('binarySearch', () => {
  it('finds an element in the middle', () => {
    expect(binarySearch([1, 3, 5, 7, 9], 5)).toBe(2);
  });

  it('finds the first element', () => {
    expect(binarySearch([2, 4, 6, 8], 2)).toBe(0);
  });

  it('finds the last element', () => {
    expect(binarySearch([2, 4, 6, 8], 8)).toBe(3);
  });

  it('returns -1 when not found', () => {
    expect(binarySearch([1, 2, 3], 99)).toBe(-1);
  });

  it('returns -1 for empty array', () => {
    expect(binarySearch([], 5)).toBe(-1);
  });

  it('finds single element', () => {
    expect(binarySearch([42], 42)).toBe(0);
  });
});

describe('lowerBound', () => {
  it('returns index of first >= target', () => {
    expect(lowerBound([1, 3, 3, 5, 7], 3)).toBe(1);
  });

  it('returns arr.length when all elements are less than target', () => {
    expect(lowerBound([1, 2, 3], 10)).toBe(3);
  });

  it('returns 0 for empty array', () => {
    expect(lowerBound([], 5)).toBe(0);
  });

  it('returns 0 when target is less than all elements', () => {
    expect(lowerBound([5, 6, 7], 1)).toBe(0);
  });
});

describe('upperBound', () => {
  it('returns index after last occurrence of target', () => {
    expect(upperBound([1, 3, 3, 5, 7], 3)).toBe(3);
  });

  it('returns arr.length when all elements are <= target', () => {
    expect(upperBound([1, 2, 3], 3)).toBe(3);
  });

  it('returns 0 for empty array', () => {
    expect(upperBound([], 5)).toBe(0);
  });
});

describe('countOccurrences', () => {
  it('counts multiple occurrences', () => {
    expect(countOccurrences([1, 2, 2, 2, 3], 2)).toBe(3);
  });

  it('returns 0 when not present', () => {
    expect(countOccurrences([1, 2, 3], 5)).toBe(0);
  });

  it('counts single occurrence', () => {
    expect(countOccurrences([1, 2, 3], 2)).toBe(1);
  });

  it('returns 0 for empty array', () => {
    expect(countOccurrences([], 1)).toBe(0);
  });
});
