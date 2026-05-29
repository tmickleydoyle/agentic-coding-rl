# Throttle

Implement `throttle` in `lib/throttle.ts`.

```ts
export function throttle<F extends (...args: any[]) => void>(fn: F, ms: number): (...args: Parameters<F>) => void
```

`throttle(fn, ms)` returns a function that invokes `fn` immediately on the first
call, then at most once per `ms` window.

Behavior:

- The very first call invokes `fn` synchronously.
- Subsequent calls within the same `ms` window are ignored (do not invoke `fn`).
- Once `ms` has elapsed since the last invocation, the next call invokes `fn`
  again immediately and opens a new window.
- `fn` receives the arguments of the call that actually triggers it.

Export `throttle` as a named export.
