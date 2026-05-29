import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from '../lib/throttle';

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes fn immediately on the first call', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t('a');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('ignores calls within the same window', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    t();
    t();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows another call after the window elapses', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t(1);
    vi.advanceTimersByTime(100);
    t(2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 2);
  });

  it('does not fire just before the window elapses', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t();
    vi.advanceTimersByTime(99);
    t();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses the args of the triggering call', () => {
    const fn = vi.fn();
    const t = throttle(fn, 50);
    t('first');
    vi.advanceTimersByTime(50);
    t('second');
    expect(fn).toHaveBeenNthCalledWith(1, 'first');
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });

  it('fires once per window across a long burst', () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    for (let i = 0; i < 30; i++) {
      t(i);
      vi.advanceTimersByTime(10);
    }
    // 0ms, 100ms, 200ms -> 3 invocations across 0..290ms
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
