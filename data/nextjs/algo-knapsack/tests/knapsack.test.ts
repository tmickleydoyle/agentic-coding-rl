import { describe, it, expect } from 'vitest';
import { knapsack, coinChange, type Item } from '../lib/knapsack';

function checkChosen(items: Item[], capacity: number, value: number, chosen: number[]): void {
  // ascending and unique
  for (let i = 1; i < chosen.length; i++) {
    expect(chosen[i]).toBeGreaterThan(chosen[i - 1]);
  }
  let w = 0;
  let v = 0;
  chosen.forEach((idx) => {
    w += items[idx].weight;
    v += items[idx].value;
  });
  expect(w).toBeLessThanOrEqual(capacity);
  expect(v).toBe(value);
}

describe('knapsack', () => {
  it('classic example', () => {
    const items: Item[] = [
      { weight: 1, value: 1 },
      { weight: 3, value: 4 },
      { weight: 4, value: 5 },
      { weight: 5, value: 7 },
    ];
    const res = knapsack(items, 7);
    expect(res.value).toBe(9); // items 1 and 3 (weights 3+4)
    checkChosen(items, 7, res.value, res.chosen);
  });

  it('capacity 0 chooses nothing', () => {
    const items: Item[] = [{ weight: 1, value: 5 }];
    expect(knapsack(items, 0)).toEqual({ value: 0, chosen: [] });
  });

  it('empty item list', () => {
    expect(knapsack([], 10)).toEqual({ value: 0, chosen: [] });
  });

  it('single item that fits', () => {
    const items: Item[] = [{ weight: 3, value: 10 }];
    const res = knapsack(items, 5);
    expect(res.value).toBe(10);
    expect(res.chosen).toEqual([0]);
  });

  it('single item that does not fit', () => {
    const items: Item[] = [{ weight: 6, value: 10 }];
    expect(knapsack(items, 5)).toEqual({ value: 0, chosen: [] });
  });

  it('exact fit takes everything', () => {
    const items: Item[] = [
      { weight: 2, value: 3 },
      { weight: 3, value: 4 },
    ];
    const res = knapsack(items, 5);
    expect(res.value).toBe(7);
    expect(res.chosen).toEqual([0, 1]);
    checkChosen(items, 5, res.value, res.chosen);
  });

  it('prefers higher value over more items', () => {
    const items: Item[] = [
      { weight: 2, value: 3 },
      { weight: 2, value: 3 },
      { weight: 4, value: 10 },
    ];
    const res = knapsack(items, 4);
    expect(res.value).toBe(10);
    checkChosen(items, 4, res.value, res.chosen);
  });

  it('zero-value items do not inflate the result', () => {
    const items: Item[] = [
      { weight: 1, value: 0 },
      { weight: 2, value: 5 },
    ];
    const res = knapsack(items, 3);
    expect(res.value).toBe(5);
    checkChosen(items, 3, res.value, res.chosen);
  });
});

describe('coinChange', () => {
  it('classic min-coin case', () => {
    expect(coinChange([1, 2, 5], 11)).toBe(3); // 5+5+1
  });

  it('amount 0 needs no coins', () => {
    expect(coinChange([1, 2, 5], 0)).toBe(0);
  });

  it('impossible amount returns -1', () => {
    expect(coinChange([2], 3)).toBe(-1);
    expect(coinChange([5, 10], 3)).toBe(-1);
  });

  it('empty coin set cannot make positive amount', () => {
    expect(coinChange([], 5)).toBe(-1);
    expect(coinChange([], 0)).toBe(0);
  });

  it('single denomination exact multiple', () => {
    expect(coinChange([3], 9)).toBe(3);
    expect(coinChange([3], 10)).toBe(-1);
  });

  it('greedy-trap case is solved optimally', () => {
    expect(coinChange([1, 3, 4], 6)).toBe(2); // 3+3, not 4+1+1
  });
});
