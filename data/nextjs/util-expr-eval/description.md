# Arithmetic expression evaluator

Implement `evaluate` in `lib/expr-eval.ts`.

```ts
export function evaluate(expr: string): number;
```

Evaluate a string arithmetic expression and return the numeric result. Support:

- Binary operators `+`, `-`, `*`, `/` with standard precedence (`*` and `/` bind tighter
  than `+` and `-`) and left associativity.
- Parentheses `(` ... `)` for grouping, nestable to any depth.
- Unary minus, e.g. `-3`, `4 * -2`, `-(1 + 2)`.
- Non-negative decimal number literals like `3`, `3.5`, `.5`, `10.0`.
- Arbitrary surrounding/internal whitespace, which is ignored.

Errors (throw an `Error`, message text is not asserted):

- Malformed input: empty/whitespace-only string, unbalanced parentheses, a trailing or
  missing operand, two operators in a row that is not a valid unary, unknown characters.
- Division by zero throws.

Use a recursive-descent parser or the shunting-yard algorithm. Do NOT use `eval` or
`Function`.

Export `evaluate` as a named export.
