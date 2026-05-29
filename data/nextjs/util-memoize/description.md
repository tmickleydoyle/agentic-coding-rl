# Memoize

Implement `memoize` in `lib/memoize.ts`.

```ts
export function memoize<F extends (...args: any[]) => any>(fn: F): F
```

Return a memoized version of `fn` that caches results keyed by the
JSON-serialized arguments (`JSON.stringify(args)`).

- The first call with a given argument set invokes `fn` and caches the result.
- Subsequent calls with the same arguments return the cached result WITHOUT
  invoking `fn` again.
- Different argument sets are cached independently.
- Works for multi-argument functions (e.g. `(a, b) => a + b`).
- The returned function returns the same values `fn` would.

Export `memoize` as a named export.
