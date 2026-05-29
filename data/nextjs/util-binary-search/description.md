# Binary search

Implement `binarySearch` in `lib/binary-search.ts`.

```ts
export function binarySearch(sortedArr: number[], target: number): number
```

Search for `target` in an ascending-sorted array using binary search.

- Returns the index of `target` if present, otherwise `-1`.
- Works on an empty array (returns `-1`), a single-element array, and targets at
  the first or last position.
- If the array contains duplicates of `target`, return the index of **any** one of
  them (any valid index is accepted).
- Runs in O(log n) — do not use `Array.prototype.indexOf`.

Export `binarySearch` as a named export.
