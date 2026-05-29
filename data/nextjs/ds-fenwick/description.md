# Fenwick tree (Binary Indexed Tree)

Implement a `Fenwick` class in `lib/fenwick.ts` supporting point updates and prefix /
range sum queries in O(log n).

```ts
export class Fenwick {
  constructor(n: number);
  static fromArray(values: number[]): Fenwick;
  update(i: number, delta: number): void;
  prefixSum(i: number): number;
  rangeSum(l: number, r: number): number;
  size(): number;
}
```

The tree represents an array of `n` numbers indexed `0 .. n - 1`, all initially `0`.

- `Fenwick(n)` builds an all-zero tree of size `n`. Throw a `RangeError` if `n < 0`.
- `Fenwick.fromArray(values)` builds a tree initialized from `values` (so
  `prefixSum(i)` reflects those values) in O(n). Does not mutate `values`.
- `update(i, delta)` adds `delta` to the element at index `i`. Throw a `RangeError`
  if `i` is out of range.
- `prefixSum(i)` returns the sum of elements at indices `0 .. i` inclusive. For
  `i < 0` return `0`. For `i >= n` it sums the whole array (clamp to the last index).
- `rangeSum(l, r)` returns the sum over indices `l .. r` inclusive. If `l > r` return
  `0`. Negative `l` is treated as `0`; `r` is clamped to the last index.
- `size()` returns `n`.

Point updates and range queries must stay consistent with a brute-force prefix-sum
oracle for any sequence of operations.

Export `Fenwick` as a named export.
