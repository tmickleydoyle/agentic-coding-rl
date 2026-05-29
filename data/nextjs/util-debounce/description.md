# Debounce

Implement `debounce` in `lib/debounce.ts`.

```ts
export function debounce<F extends (...args: any[]) => void>(fn: F, ms: number): (...args: Parameters<F>) => void
```

`debounce(fn, ms)` returns a new function that delays invoking `fn` until `ms`
milliseconds have elapsed since the last time the debounced function was called.

Behavior:

- Calling the debounced function schedules `fn` to run after `ms` ms.
- If it is called again before that timer fires, the previous timer is cancelled
  and a new one is started (the timer resets on every call).
- `fn` is invoked with the arguments from the **most recent** call.
- After `fn` finally fires, a later call starts a fresh cycle again.

Default export is not required; export `debounce` as a named export.
