# Deep clone

Implement `deepClone` in `lib/deep-clone.ts`.

```ts
export function deepClone<T>(value: T): T
```

Return a deep copy of `value`:

- Primitives (`number`, `string`, `boolean`, `null`, `undefined`) are returned as-is.
- Arrays are cloned element-by-element (recursively), producing a new array.
- Plain objects are cloned key-by-key (recursively), producing a new object.
- The result must share **no** object/array references with the source: mutating a
  nested object/array in the clone must not affect the original, and vice versa.
- Nested combinations of objects and arrays are handled to arbitrary depth.

Export `deepClone` as a named export.
