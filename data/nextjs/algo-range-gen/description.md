# algo-range-gen

Implement number range utility functions: `range`, `clamp`, and `linspace`.

## Signatures

```typescript
export function range(start: number, end: number, step?: number): number[]
export function clamp(value: number, min: number, max: number): number
export function linspace(start: number, end: number, n: number): number[]
```

## Behavior

### `range(start, end, step?)`
- Returns an array of numbers from `start` (inclusive) up to but not including `end`
- Default `step` is `1`
- If `step` is positive and `start >= end`, returns `[]`
- If `step` is negative and `start <= end`, returns `[]`
- Supports negative step (counting down)
- Throws `RangeError` if `step === 0`

### `clamp(value, min, max)`
- Returns `min` if `value < min`
- Returns `max` if `value > max`
- Returns `value` otherwise
- If `min > max`, behavior is undefined (no need to handle)

### `linspace(start, end, n)`
- Returns an array of `n` evenly spaced numbers from `start` to `end` (both inclusive)
- If `n === 1`, returns `[start]`
- If `n === 0`, returns `[]`
- Throws `RangeError` if `n < 0`

## Edge Cases

- `range(0, 0)` → `[]`
- `range(5, 0, -1)` → `[5, 4, 3, 2, 1]`
- `clamp(10, 0, 5)` → `5`
- `clamp(-3, 0, 5)` → `0`
- `linspace(0, 1, 3)` → `[0, 0.5, 1]`
- `linspace(0, 10, 1)` → `[0]`
