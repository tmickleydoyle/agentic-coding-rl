import { describe, it, expect, beforeEach } from 'vitest';
import { debounce, throttle } from '../reference/lib/debounce-fn';

describe('debounce', () => {
  it('does not call fn immediately', () => {
    let called = false;
    const fn = debounce(() => { called = true; }, 100);
    fn();
    expect(called).toBe(false);
  });

  it('calls fn after the wait period (using fake timers)', async () => {
    let called = false;
    const fn = debounce(() => { called = true; }, 10);
    fn();
    await new Promise(r => setTimeout(r, 20));
    expect(called).toBe(true);
  });

  it('resets timer on repeated calls', async () => {
    let count = 0;
    const fn = debounce(() => { count++; }, 30);
    fn();
    await new Promise(r => setTimeout(r, 10));
    fn();
    await new Promise(r => setTimeout(r, 10));
    fn();
    await new Promise(r => setTimeout(r, 50));
    expect(count).toBe(1);
  });

  it('cancel prevents fn from being called', async () => {
    let called = false;
    const fn = debounce(() => { called = true; }, 20);
    fn();
    fn.cancel();
    await new Promise(r => setTimeout(r, 40));
    expect(called).toBe(false);
  });

  it('flush calls fn immediately if pending', () => {
    let called = false;
    const fn = debounce(() => { called = true; }, 1000);
    fn();
    fn.flush();
    expect(called).toBe(true);
  });

  it('flush is a no-op when nothing is pending', () => {
    let count = 0;
    const fn = debounce(() => { count++; }, 1000);
    fn.flush();
    expect(count).toBe(0);
  });
});

describe('throttle', () => {
  it('calls fn on the first invocation', () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 100);
    fn();
    expect(count).toBe(1);
  });

  it('ignores calls within the limit window', () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 100);
    fn();
    fn();
    fn();
    expect(count).toBe(1);
  });

  it('allows call after limit window has passed', async () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 20);
    fn();
    await new Promise(r => setTimeout(r, 30));
    fn();
    expect(count).toBe(2);
  });

  it('cancel resets throttle so next call runs immediately', async () => {
    let count = 0;
    const fn = throttle(() => { count++; }, 1000);
    fn();
    fn.cancel();
    fn();
    expect(count).toBe(2);
  });
});
