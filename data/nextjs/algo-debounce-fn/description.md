# algo-debounce-fn

Implement `debounce` and `throttle` utility functions for controlling function invocation rate.

## Signatures

```typescript
export interface DebouncedFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait: number): DebouncedFn<T>

export interface ThrottledFn<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): ThrottledFn<T>
```

## Behavior

### `debounce(fn, wait)`
- Delays invoking `fn` until `wait` ms have elapsed since the last call
- Each new call resets the timer
- `.cancel()` cancels the pending invocation
- `.flush()` immediately invokes the pending call (if any), then cancels the timer

### `throttle(fn, limit)`
- Ensures `fn` is called at most once per `limit` ms window
- The first call in a window executes immediately
- Subsequent calls within the window are ignored
- `.cancel()` resets the throttle state so the next call executes immediately

## Edge Cases

- `debounce` with `wait = 0` still defers execution to the next timer tick
- Calling `.cancel()` when nothing is pending is a no-op
- Calling `.flush()` when nothing is pending is a no-op
- `throttle` allows the next call after the limit period has passed
