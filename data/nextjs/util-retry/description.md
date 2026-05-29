# Retry

Implement `retry` in `lib/retry.ts`.

```ts
export function retry<T>(fn: () => Promise<T>, attempts: number): Promise<T>
```

`retry(fn, attempts)` invokes the async `fn` and retries on rejection.

Behavior:

- Call `fn()`. If the returned promise resolves, resolve with that value.
- If it rejects, call `fn()` again, up to a total of `attempts` invocations.
- Resolve as soon as any attempt succeeds (do not call `fn` again afterward).
- If every one of the `attempts` invocations rejects, reject with the error from
  the **last** failed attempt.
- `attempts` is the total number of tries (so `attempts === 1` means a single try,
  no retry).

Export `retry` as a named export.
