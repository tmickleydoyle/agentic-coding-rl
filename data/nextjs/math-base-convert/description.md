# Arbitrary base conversion

Implement conversion of a non-negative integer between numeric bases in
`lib/base-convert.ts`.

```ts
export function convert(value: string, fromBase: number, toBase: number): string;
```

Behavior:

- `value` is the number as a string of digits valid in `fromBase`. Digits are
  `0-9` then `a-z` for values `10..35` (so base 16 uses `0-9a-f`). Input is
  **case-insensitive**; output is always **lowercase**.
- `fromBase` and `toBase` are integers in `2..36`. Throw an `Error` if either is
  out of range or not an integer.
- Throw an `Error` if `value` is empty or contains any digit not valid in
  `fromBase` (e.g. `"8"` in base 8, `"g"` in base 16).
- The value may be far larger than `Number.MAX_SAFE_INTEGER`, so you must NOT round
  through `parseInt`/`Number`. Implement conversion via repeated division on a
  digit array (base-N long division), so arbitrarily large inputs work exactly.
- Leading zeros in the input are allowed and ignored. Output has no leading zeros;
  zero converts to `"0"` in any base.

Examples: `convert("255", 10, 16) === "ff"`, `convert("ff", 16, 2) === "11111111"`,
`convert("z", 36, 10) === "35"`.
