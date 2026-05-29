# Mini-Lisp evaluator

Implement a minimal Lisp evaluator in `lib/lisp.ts`.

```ts
export function evalLisp(src: string): number | boolean;
```

Parse the s-expression source yourself and evaluate it.

## Grammar / semantics

- **Integer literals**: e.g. `42`, `-3`. Evaluate to that number.
- **Arithmetic**: `(+ a b ...)`, `(- a b ...)`, `(* a b ...)`, `(/ a b ...)`.
  Each takes one or more numeric arguments and folds left-to-right.
  `(- 5)` is `5` (no negation of a single arg — it just returns it);
  `(- 10 3 2)` is `5`. `(/ ...)` throws on division by zero.
- **Comparisons**: `(< a b)`, `(> a b)`, `(= a b)` take exactly two numeric
  arguments and return a boolean.
- **Conditional**: `(if cond then else)`. `cond` evaluates to a boolean;
  evaluate and return `then` if `true`, else `else`. Exactly three arguments.
- **Let binding**: `(let ((x e1) (y e2) ...) body)`. Evaluate each `ei` in the
  *outer* scope, bind the names, then evaluate `body` in the extended scope.
  Inner `let` shadows outer bindings. A bare symbol resolves to its bound value.

Whitespace (spaces/newlines) separates tokens; parentheses group. There is
exactly one top-level expression.

## Errors (throw `Error`)

- Malformed input: unbalanced parentheses, empty expression, or trailing tokens
  after the first complete expression.
- Unknown function/operator in head position.
- An unbound symbol.
- Wrong argument count for `if`, the comparisons, or an arithmetic op with zero
  args.
- Division by zero.
- A type mismatch (e.g. using a boolean where a number is required, or vice
  versa).

`evalLisp` is a named export.
