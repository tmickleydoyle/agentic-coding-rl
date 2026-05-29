# Deep equal

Implement `deepEqual` in `lib/deep-equal.ts`.

```ts
export function deepEqual(a: unknown, b: unknown): boolean
```

Return `true` iff `a` and `b` are structurally equal.

Rules:

- Primitives compare by value, EXCEPT `NaN` is considered equal to `NaN`
  (so `deepEqual(NaN, NaN) === true`).
- Objects are equal iff they have the same set of own enumerable keys and every
  corresponding value is `deepEqual`. Differing key counts -> not equal.
- Arrays are equal iff same length and each element is `deepEqual`.
- An array is never equal to a plain object, even if "shaped" similarly.
- `null` is only equal to `null` (and not to any object).
- Nested structures are compared recursively.

Export `deepEqual` as a named export.
