import { describe, it, expect } from 'vitest';
import { MinHeap, kSmallest, type Comparator } from '../lib/min-heap';

describe('MinHeap', () => {
  it('peek and size on an empty heap', () => {
    const h = new MinHeap<number>();
    expect(h.size()).toBe(0);
    expect(h.peek()).toBeUndefined();
    expect(h.pop()).toBeUndefined();
  });

  it('pops elements in ascending order', () => {
    const h = new MinHeap<number>();
    [5, 1, 4, 2, 3].forEach((x) => h.push(x));
    const out: number[] = [];
    while (h.size() > 0) out.push(h.pop() as number);
    expect(out).toEqual([1, 2, 3, 4, 5]);
  });

  it('peek returns the minimum without removing', () => {
    const h = new MinHeap<number>();
    h.push(3);
    h.push(1);
    h.push(2);
    expect(h.peek()).toBe(1);
    expect(h.size()).toBe(3);
  });

  it('supports a custom comparator (max-heap)', () => {
    const maxCmp: Comparator<number> = (a, b) => b - a;
    const h = new MinHeap<number>(maxCmp);
    [1, 5, 3].forEach((x) => h.push(x));
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBe(3);
    expect(h.pop()).toBe(1);
  });

  it('orders strings ascending by default', () => {
    const h = new MinHeap<string>();
    ['banana', 'apple', 'cherry'].forEach((x) => h.push(x));
    expect(h.pop()).toBe('apple');
    expect(h.pop()).toBe('banana');
    expect(h.pop()).toBe('cherry');
  });

  it('heapify builds a valid heap', () => {
    const h = MinHeap.heapify([9, 4, 7, 1, 8, 2]);
    const out: number[] = [];
    while (h.size() > 0) out.push(h.pop() as number);
    expect(out).toEqual([1, 2, 4, 7, 8, 9]);
  });

  it('heapify does not mutate the input array', () => {
    const input = [3, 1, 2];
    MinHeap.heapify(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('handles duplicates', () => {
    const h = new MinHeap<number>();
    [2, 2, 1, 1, 3].forEach((x) => h.push(x));
    const out: number[] = [];
    while (h.size() > 0) out.push(h.pop() as number);
    expect(out).toEqual([1, 1, 2, 2, 3]);
  });

  it('pop to empty then push again works', () => {
    const h = new MinHeap<number>();
    h.push(1);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBeUndefined();
    h.push(7);
    expect(h.peek()).toBe(7);
  });
});

describe('kSmallest', () => {
  it('returns the k smallest in ascending order', () => {
    expect(kSmallest([5, 3, 8, 1, 9, 2], 3)).toEqual([1, 2, 3]);
  });

  it('returns [] for k <= 0', () => {
    expect(kSmallest([1, 2, 3], 0)).toEqual([]);
    expect(kSmallest([1, 2, 3], -2)).toEqual([]);
  });

  it('returns all sorted when k >= length', () => {
    expect(kSmallest([3, 1, 2], 10)).toEqual([1, 2, 3]);
  });

  it('respects a custom comparator and does not mutate input', () => {
    const arr = [1, 5, 3, 2];
    const desc: Comparator<number> = (a, b) => b - a;
    expect(kSmallest(arr, 2, desc)).toEqual([5, 3]);
    expect(arr).toEqual([1, 5, 3, 2]);
  });
});
