# Arbitrary-precision unsigned integer arithmetic

Implement arbitrary-precision arithmetic on **non-negative integers represented as
decimal strings** in `lib/bignum.ts`. You must NOT use the native `BigInt` type or
`bigint` literals — implement the algorithms manually (digit-by-digit). Numbers may
be far longer than `Number` can represent exactly (50+ digits).

```ts
export function add(a: string, b: string): string;
export function subtract(a: string, b: string): string; // requires a >= b
export function multiply(a: string, b: string): string;
export function compare(a: string, b: string): number; // -1 | 0 | 1
```

Behavior:

- Inputs are strings of decimal digits (`/^[0-9]+$/`). They may contain leading
  zeros (e.g. `"007"`). The empty string is NOT a valid input.
- All functions must throw an `Error` if either argument is not a valid
  non-negative decimal integer string.
- `add(a, b)` returns the decimal sum with NO leading zeros (except the single
  digit `"0"` for a zero result).
- `subtract(a, b)` returns `a - b`. The caller guarantees `a >= b`; if `a < b`
  (numerically) throw an `Error`. Result has no leading zeros.
- `multiply(a, b)` returns `a * b` with no leading zeros. `multiply("0", x)` is
  `"0"`.
- `compare(a, b)` returns `-1` if `a < b`, `0` if equal, `1` if `a > b`, comparing
  numerically (so `"007"` equals `"7"`).

All results must be normalized (no leading zeros, zero is `"0"`).
