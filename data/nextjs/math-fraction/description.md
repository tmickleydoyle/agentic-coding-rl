# Rational number (Fraction) class

Implement a `Fraction` class in `lib/fraction.ts` representing an exact rational
number, always stored in lowest terms with a normalized sign.

```ts
export class Fraction {
  constructor(num: number, den?: number); // den defaults to 1
  readonly num: number; // numerator (carries the sign)
  readonly den: number; // denominator (always > 0)

  add(other: Fraction): Fraction;
  sub(other: Fraction): Fraction;
  mul(other: Fraction): Fraction;
  div(other: Fraction): Fraction; // throws on division by zero fraction
  equals(other: Fraction): boolean;
  toString(): string;
  valueOf(): number;
}
```

Behavior:

- The constructor throws an `Error` if `den` is `0`, or if either argument is not
  an integer (use `Number.isInteger`).
- The stored fraction is **auto-reduced** by the gcd, and the **sign lives on the
  numerator**: `den` is always positive. So `new Fraction(2, -4)` becomes
  `num = -1, den = 2`. `new Fraction(0, -5)` becomes `num = 0, den = 1`.
- `add`/`sub`/`mul`/`div` return a NEW reduced `Fraction` and do not mutate either
  operand. `div` throws if `other` is zero (numerator 0).
- `equals(other)` is true iff the reduced forms are identical.
- `toString()` returns `"num/den"`, except when `den === 1` it returns just the
  integer (e.g. `"3"`, `"-2"`, `"0"`).
- `valueOf()` returns the floating-point value `num / den` (so `+f` and numeric
  coercion work).

Export `Fraction` as a named export.
