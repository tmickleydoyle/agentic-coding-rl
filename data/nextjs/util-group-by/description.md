# Group by

Implement `groupBy` in `lib/group-by.ts`.

```ts
export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]>
```

Group the items of `arr` by the string key returned by `keyFn`.

- Returns an object mapping each distinct key to the array of items that produced it.
- Items within each group preserve their original relative order.
- An empty input array returns `{}`.
- Keys appear in the result as first encountered.

Export `groupBy` as a named export.
