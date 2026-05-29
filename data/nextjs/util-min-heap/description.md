# Binary min-heap

Implement a `MinHeap` class and a `kSmallest` helper in `lib/min-heap.ts`.

```ts
export type Comparator<T> = (a: T, b: T) => number;

export class MinHeap<T> {
  constructor(compare?: Comparator<T>);
  push(value: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
  static heapify<T>(values: T[], compare?: Comparator<T>): MinHeap<T>;
}

export function kSmallest<T>(arr: T[], k: number, compare?: Comparator<T>): T[];
```

`MinHeap<T>` is an array-backed binary heap.

- `compare(a, b)` returns negative if `a` should come out before `b`, positive if after,
  `0` if equal. The default comparator orders numbers/strings ascending using `<`/`>`.
- `push(value)` inserts and sift-ups.
- `pop()` removes and returns the minimum (by the comparator), or `undefined` if empty.
- `peek()` returns the minimum without removing it, or `undefined` if empty.
- `size()` returns the number of elements.
- `MinHeap.heapify(values, compare?)` builds a heap from an array in O(n) (does not
  mutate the input array) and returns the new heap.

`kSmallest(arr, k, compare?)` returns the `k` smallest elements of `arr` in ascending
order (by the comparator). If `k <= 0` returns `[]`; if `k >= arr.length` returns all
elements sorted. Must not mutate `arr`.

Export `MinHeap`, `kSmallest`, and `Comparator` as named exports.
