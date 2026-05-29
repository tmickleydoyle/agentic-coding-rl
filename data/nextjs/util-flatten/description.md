# Flatten

Implement `flatten` in `lib/flatten.ts`.

```ts
export function flatten(arr: unknown[], depth?: number): unknown[]
```

Flatten a nested array up to `depth` levels deep.

- `depth` defaults to `Infinity` (fully flatten all nesting).
- `depth === 1` flattens exactly one level.
- `depth === 0` returns a shallow copy of the array unchanged.
- Non-array elements are kept as-is (passthrough); only nested arrays are expanded.
- Order of elements is preserved.

Examples:

```ts
flatten([1, [2, [3, [4]]]])        // [1, 2, 3, 4]
flatten([1, [2, [3]]], 1)          // [1, 2, [3]]
flatten([1, [2, 3], 4], 0)         // [1, [2, 3], 4]
```

Export `flatten` as a named export.
