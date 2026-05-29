# Roman numeral conversion

Implement conversion between integers and Roman numerals in `lib/roman.ts`.

```ts
export function toRoman(n: number): string;
export function fromRoman(s: string): number;
```

Behavior:

- `toRoman(n)` converts an integer `1..3999` to its canonical uppercase Roman
  numeral (e.g. `4 -> "IV"`, `1994 -> "MCMXCIV"`, `3888 -> "MMMDCCCLXXXVIII"`).
  Throw an `Error` if `n` is not an integer in `1..3999`.
- `fromRoman(s)` parses a Roman numeral and returns its integer value. It must be
  STRICT: only the canonical form is accepted. Throw an `Error` for any malformed
  or non-canonical numeral, including:
  - empty string or characters other than `I V X L C D M`,
  - more than three consecutive identical symbols (`"IIII"`, `"XXXX"`),
  - repeated `V`, `L`, or `D` (`"VV"`, `"LL"`),
  - invalid subtractive pairs (`"IC"`, `"IL"`, `"VX"`),
  - any string whose value does not round-trip (`toRoman(fromRoman(s)) === s`).
- `fromRoman` may be implemented by parsing then verifying `toRoman` of the result
  equals the (uppercased) input — this guarantees canonical-only acceptance.

Round-trip property: for every `n` in `1..3999`,
`fromRoman(toRoman(n)) === n`.
