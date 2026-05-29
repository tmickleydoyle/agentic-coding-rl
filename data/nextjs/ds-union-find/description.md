# Disjoint Set Union (Union-Find)

Implement a `DSU` class in `lib/union-find.ts`.

```ts
export class DSU {
  constructor(n: number);
  find(x: number): number;
  union(a: number, b: number): boolean;
  connected(a: number, b: number): boolean;
  count(): number;
}
```

`DSU(n)` creates a disjoint-set structure over the `n` elements `0 .. n - 1`, each
initially in its own singleton component. If `n < 0` throw a `RangeError`.

- `find(x)` returns the canonical representative (root) of the set containing `x`,
  using **path compression** so repeated calls stay near O(1) amortized. If `x` is
  out of range (`x < 0` or `x >= n`) throw a `RangeError`.
- `union(a, b)` merges the sets containing `a` and `b` using **union by rank**.
  Returns `true` if a merge actually happened, or `false` if `a` and `b` were already
  in the same set (idempotent). Throws a `RangeError` for out-of-range `a`/`b`.
- `connected(a, b)` returns `true` iff `a` and `b` are in the same set. Throws a
  `RangeError` for out-of-range arguments.
- `count()` returns the current number of distinct components.

Union is transitive: after `union(a, b)` and `union(b, c)`, `connected(a, c)` is
`true`. Merging two elements already in the same component must not change `count()`.

Export `DSU` as a named export.
