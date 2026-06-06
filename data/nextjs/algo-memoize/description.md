# algo-memoize

Implement a `memoize` function that caches the results of a function based on its arguments.

## Signatures

```typescript
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T & { cache: Map<string, ReturnType<T>> }
export function memoizeWithResolver<T extends (...args: unknown[]) => unknown>(
  fn: T,
  resolver: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>> }
```

## Behavior

### `memoize(fn)`
- Returns a wrapped version of `fn` that caches return values
- Cache key is computed by `JSON.stringify(args)`
- Subsequent calls with the same arguments return the cached value without calling `fn` again
- The wrapped function exposes a `.cache` property (a `Map<string, ReturnType<T>>`)

### `memoizeWithResolver(fn, resolver)`
- Same as `memoize` but uses the provided `resolver` function to compute the cache key
- `resolver` receives the same arguments as `fn` and returns a string key

## Edge Cases

- Works with zero-argument functions (key is `"[]"`)
- Works with multiple arguments
- Cache is shared across calls (persists between invocations)
- Functions with side effects are only called once per unique key
- Handles primitive and object arguments (via JSON.stringify for default)
