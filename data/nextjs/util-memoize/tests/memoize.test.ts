import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../lib/memoize';

describe('memoize', () => {
  it('returns the correct result', () => {
    const m = memoize((a: number, b: number) => a + b);
    expect(m(2, 3)).toBe(5);
  });

  it('calls the underlying fn only once per distinct arg set', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const m = memoize(spy);
    m(2, 3);
    m(2, 3);
    m(2, 3);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('caches distinct argument sets independently', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const m = memoize(spy);
    expect(m(2, 3)).toBe(5);
    expect(m(4, 5)).toBe(9);
    expect(m(2, 3)).toBe(5);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('works for single-argument functions', () => {
    const spy = vi.fn((n: number) => n * n);
    const m = memoize(spy);
    expect(m(4)).toBe(16);
    expect(m(4)).toBe(16);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('distinguishes argument order', () => {
    const spy = vi.fn((a: number, b: number) => a - b);
    const m = memoize(spy);
    expect(m(5, 1)).toBe(4);
    expect(m(1, 5)).toBe(-4);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('handles string arguments', () => {
    const spy = vi.fn((s: string) => s.toUpperCase());
    const m = memoize(spy);
    expect(m('hi')).toBe('HI');
    expect(m('hi')).toBe('HI');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
