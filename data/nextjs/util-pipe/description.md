# Pipe / compose

Implement `pipe` and `compose` in `lib/pipe.ts`.

```ts
export function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any;
export function compose(...fns: Array<(arg: any) => any>): (arg: any) => any;
```

- `pipe(f, g, h)` returns a function `x => h(g(f(x)))` — functions apply
  **left to right**.
- `compose(f, g, h)` returns a function `x => f(g(h(x)))` — functions apply
  **right to left**.
- With no functions, both return the identity function (`x => x`).
- With a single function, both behave like that function.

Types can be loose (`any`). Export both as named exports.
