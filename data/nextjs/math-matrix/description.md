# Matrix operations

Implement basic linear-algebra operations on matrices of numbers in
`lib/matrix.ts`. A matrix is `number[][]` in row-major order; all rows must have
equal length.

```ts
export type Matrix = number[][];

export function multiply(a: Matrix, b: Matrix): Matrix;
export function transpose(m: Matrix): Matrix;
export function identity(n: number): Matrix;
export function determinant(m: Matrix): number;     // square only
export function inverse(m: Matrix): Matrix | null;   // null if singular
```

Behavior:

- `multiply(a, b)` returns the matrix product. Throw an `Error` if the inner
  dimensions don't match (`a`'s column count must equal `b`'s row count).
- `transpose(m)` swaps rows and columns.
- `identity(n)` returns the `n x n` identity matrix. Throw if `n < 1` or `n` is not
  an integer.
- `determinant(m)` works for any `n x n` matrix (use cofactor expansion or LU).
  Throw an `Error` if `m` is not square. `determinant` of a `1x1` is its single
  element.
- `inverse(m)` returns the inverse for a square matrix, or `null` if the matrix is
  singular (determinant `0`). Throw if not square. Use Gauss-Jordan elimination;
  treat a pivot whose absolute value is `< 1e-12` as zero (singular).

Results may carry floating-point error; tests compare within an epsilon. Functions
must not mutate their inputs.
