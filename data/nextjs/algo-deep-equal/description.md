# algo-deep-equal

Implement a `deepEqual` function that performs a deep structural equality check between two values.

## Signature

```typescript
export function deepEqual(a: unknown, b: unknown): boolean
```

## Behavior

- **Primitives**: compare with `===` (number, string, boolean, null, undefined, bigint, symbol)
- **Arrays**: same length, every element deeply equal (order matters)
- **Plain objects**: same set of own enumerable keys, every value deeply equal
- **Nested structures**: recurse arbitrarily deep
- **NaN**: `deepEqual(NaN, NaN)` returns `true`
- **Different types**: if `typeof a !== typeof b`, return `false`
- **null vs object**: `null` is not equal to `{}`
- **Array vs object**: `[]` is not equal to `{}`

## Edge Cases

- Empty array equals empty array
- Empty object equals empty object
- Arrays with different lengths are not equal
- Objects with different key sets are not equal
- Deeply nested objects/arrays must be recursed
- `deepEqual(NaN, NaN)` → `true`
- `deepEqual(null, null)` → `true`
- `deepEqual(null, undefined)` → `false`
