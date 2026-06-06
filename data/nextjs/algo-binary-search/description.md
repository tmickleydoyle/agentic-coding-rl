# algo-binary-search

Implement a binary search library for sorted numeric arrays.

## Functions to export

### `binarySearch(arr: number[], target: number): number`
Search for `target` in the sorted array `arr`.
- Returns the index of `target` if found.
- Returns `-1` if `target` is not in the array.
- The input array is sorted in ascending order.
- Empty array returns `-1`.

### `lowerBound(arr: number[], target: number): number`
Return the index of the first element that is **greater than or equal to** `target`.
- If all elements are less than `target`, return `arr.length`.
- Empty array returns `0`.

### `upperBound(arr: number[], target: number): number`
Return the index of the first element that is **strictly greater than** `target`.
- If all elements are less than or equal to `target`, return `arr.length`.
- Empty array returns `0`.

### `countOccurrences(arr: number[], target: number): number`
Count how many times `target` appears in sorted array `arr`.
Uses `lowerBound` and `upperBound` internally.
- Returns `0` if `target` is not present.

## Edge cases
- Empty arrays must not throw.
- Single-element arrays.
- Target smaller than all elements.
- Target larger than all elements.
- Duplicate values in the array.
