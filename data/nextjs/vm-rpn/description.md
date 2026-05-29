# RPN calculator + shunting-yard

Implement two functions in `lib/rpn.ts`.

```ts
export function evalRPN(tokens: string[]): number;
export function infixToRPN(expr: string): string[];
```

## `evalRPN(tokens)`

Evaluate a list of tokens in reverse-polish (postfix) notation and return the
numeric result.

- Number tokens are parsed with `Number(token)`; a token is a number iff it is
  finite (e.g. `'3'`, `'-2'`, `'4.5'`).
- Binary operators: `'+'`, `'-'`, `'*'`, `'/'`. They pop the top two values
  `b` (top) then `a` (next) and push `a op b`.
- Unary operator: `'neg'` pops one value `x` and pushes `-x`.
- After consuming all tokens there must be exactly one value on the stack;
  return it.

Errors (throw `Error`):

- A binary op with fewer than 2 values, or `'neg'` with 0 values
  (stack underflow).
- Division by zero (`'/'` with divisor `0`).
- An unknown token (not a finite number and not a known operator).
- Leftover values: after processing, the stack size is not exactly 1
  (e.g. `['1','2']`), or the input is empty.

## `infixToRPN(expr)`

Convert an infix arithmetic expression string to a list of RPN tokens using the
shunting-yard algorithm, so that `evalRPN(infixToRPN(e))` computes `e`.

- Tokens in `expr` are separated by whitespace. Supported tokens: numbers,
  the binary operators `+ - * /`, and parentheses `(` `)`.
- Precedence: `*` and `/` bind tighter than `+` and `-`. All four operators are
  left-associative.
- Parentheses override precedence and must be balanced.

Errors (throw `Error`): mismatched parentheses, or an unknown token.

Both are named exports.
