import { describe, it, expect } from 'vitest';
import { memoize, memoizeWithResolver } from '../reference/lib/memoize';

describe('memoize', () => {
  it('returns the correct result', () => {
    const add = memoize((a: unknown, b: unknown) => (a as number) + (b as number));
    expect(add(1, 2)).toBe(3);
  });

  it('calls the function only once for the same arguments', () => {
    let callCount = 0;
    const fn = memoize((...args: unknown[]) => {
      callCount++;
      return (args[0] as number) * 2;
    });
    fn(5);
    fn(5);
    fn(5);
    expect(callCount).toBe(1);
  });

  it('calls the function again for different arguments', () => {
    let callCount = 0;
    const fn = memoize((...args: unknown[]) => {
      callCount++;
      return args[0];
    });
    fn(1);
    fn(2);
    expect(callCount).toBe(2);
  });

  it('exposes a cache property', () => {
    const fn = memoize((...args: unknown[]) => (args[0] as number) + 1);
    fn(10);
    expect(fn.cache).toBeInstanceOf(Map);
    expect(fn.cache.size).toBe(1);
  });

  it('works with zero-argument functions', () => {
    let count = 0;
    const fn = memoize(() => {
      count++;
      return 42;
    });
    expect(fn()).toBe(42);
    expect(fn()).toBe(42);
    expect(count).toBe(1);
  });

  it('handles object arguments via JSON.stringify key', () => {
    let count = 0;
    const fn = memoize((...args: unknown[]) => {
      count++;
      return (args[0] as { v: number }).v;
    });
    fn({ v: 1 });
    fn({ v: 1 });
    expect(count).toBe(1);
    fn({ v: 2 });
    expect(count).toBe(2);
  });
});

describe('memoizeWithResolver', () => {
  it('uses the resolver to compute the cache key', () => {
    let count = 0;
    const fn = memoizeWithResolver(
      (...args: unknown[]) => {
        count++;
        return (args[0] as { id: number }).id;
      },
      (obj: unknown) => String((obj as { id: number }).id)
    );
    fn({ id: 1, extra: 'a' });
    fn({ id: 1, extra: 'b' });
    expect(count).toBe(1);
  });

  it('exposes a cache property', () => {
    const fn = memoizeWithResolver(
      (...args: unknown[]) => args[0],
      (...args: unknown[]) => String(args[0])
    );
    fn('hello');
    expect(fn.cache.has('hello')).toBe(true);
  });

  it('calls fn again for different resolver keys', () => {
    let count = 0;
    const fn = memoizeWithResolver(
      (...args: unknown[]) => { count++; return args[0]; },
      (...args: unknown[]) => String(args[0])
    );
    fn('a');
    fn('b');
    expect(count).toBe(2);
  });
});
