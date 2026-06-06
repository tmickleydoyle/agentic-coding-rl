type AnyFn = (...args: unknown[]) => unknown;
type Memoized<T extends AnyFn> = T & { cache: Map<string, ReturnType<T>> };

export function memoize<T extends AnyFn>(fn: T): Memoized<T> {
  throw new Error('not implemented');
}

export function memoizeWithResolver<T extends AnyFn>(
  fn: T,
  resolver: (...args: Parameters<T>) => string
): Memoized<T> {
  throw new Error('not implemented');
}
