type AnyFn = (...args: unknown[]) => unknown;
type Memoized<T extends AnyFn> = T & { cache: Map<string, ReturnType<T>> };

export function memoize<T extends AnyFn>(fn: T): Memoized<T> {
  const cache = new Map<string, ReturnType<T>>();

  const wrapped = ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as Memoized<T>;

  wrapped.cache = cache;
  return wrapped;
}

export function memoizeWithResolver<T extends AnyFn>(
  fn: T,
  resolver: (...args: Parameters<T>) => string
): Memoized<T> {
  const cache = new Map<string, ReturnType<T>>();

  const wrapped = ((...args: unknown[]) => {
    const key = resolver(...(args as Parameters<T>));
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as Memoized<T>;

  wrapped.cache = cache;
  return wrapped;
}
