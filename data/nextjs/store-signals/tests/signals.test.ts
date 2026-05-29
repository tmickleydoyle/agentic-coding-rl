import { describe, it, expect, vi } from 'vitest';
import { signal, computed, effect } from '../lib/signals';

describe('store-signals', () => {
  it('signal get/set', () => {
    const s = signal(1);
    expect(s.get()).toBe(1);
    s.set(2);
    expect(s.get()).toBe(2);
  });

  it('effect runs immediately and on dependency change', () => {
    const s = signal(0);
    const spy = vi.fn(() => {
      s.get();
    });
    effect(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    s.set(1);
    expect(spy).toHaveBeenCalledTimes(2);
    s.set(2);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('setting an unchanged value does not re-run effects', () => {
    const s = signal(5);
    const spy = vi.fn(() => {
      s.get();
    });
    effect(spy);
    s.set(5);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('effect only depends on signals actually read', () => {
    const a = signal(1);
    const b = signal(10);
    const spy = vi.fn(() => {
      a.get();
    });
    effect(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    b.set(20); // not a dependency
    expect(spy).toHaveBeenCalledTimes(1);
    a.set(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('computed derives and memoizes', () => {
    const s = signal(2);
    const fn = vi.fn(() => s.get() * 10);
    const c = computed(fn);
    expect(c.get()).toBe(20);
    expect(c.get()).toBe(20); // cached, no recompute
    expect(fn).toHaveBeenCalledTimes(1);
    s.set(3);
    expect(c.get()).toBe(30);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('computed only recomputes when its deps change', () => {
    const a = signal(1);
    const b = signal(2);
    const fn = vi.fn(() => a.get() + 100);
    const c = computed(fn);
    expect(c.get()).toBe(101);
    b.set(5); // c does not read b
    expect(c.get()).toBe(101);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('effect tracks computed dependencies', () => {
    const s = signal(1);
    const c = computed(() => s.get() * 2);
    const seen: number[] = [];
    effect(() => {
      seen.push(c.get());
    });
    s.set(2);
    s.set(3);
    expect(seen).toEqual([2, 4, 6]);
  });

  it('diamond dependency does not double-fire and is never stale', () => {
    const a = signal(1);
    const b = computed(() => a.get() + 1);
    const c = computed(() => a.get() * 2);
    const d = computed(() => b.get() + c.get());
    const seen: number[] = [];
    const spy = vi.fn(() => {
      seen.push(d.get());
    });
    effect(spy);
    // initial: b=2, c=2, d=4
    expect(seen).toEqual([4]);
    a.set(2); // b=3, c=4, d=7  -- single re-run, consistent values
    expect(spy).toHaveBeenCalledTimes(2);
    expect(seen).toEqual([4, 7]);
    a.set(10); // b=11, c=20, d=31
    expect(spy).toHaveBeenCalledTimes(3);
    expect(seen).toEqual([4, 7, 31]);
  });

  it('d.get() reflects latest value without an effect', () => {
    const a = signal(3);
    const b = computed(() => a.get() + 1);
    const c = computed(() => a.get() * 2);
    const d = computed(() => b.get() + c.get());
    expect(d.get()).toBe(3 + 1 + 3 * 2);
    a.set(5);
    expect(d.get()).toBe(5 + 1 + 5 * 2);
  });

  it('disposed effect stops running', () => {
    const s = signal(0);
    const spy = vi.fn(() => {
      s.get();
    });
    const dispose = effect(spy);
    s.set(1);
    expect(spy).toHaveBeenCalledTimes(2);
    dispose();
    s.set(2);
    s.set(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('conditional dependencies update subscriptions across runs', () => {
    const cond = signal(true);
    const a = signal('a');
    const b = signal('b');
    const seen: string[] = [];
    effect(() => {
      seen.push(cond.get() ? a.get() : b.get());
    });
    expect(seen).toEqual(['a']);
    b.set('b2'); // not currently a dep
    expect(seen).toEqual(['a']);
    cond.set(false); // now reads b
    expect(seen).toEqual(['a', 'b2']);
    a.set('a2'); // no longer a dep
    expect(seen).toEqual(['a', 'b2']);
    b.set('b3'); // now a dep
    expect(seen).toEqual(['a', 'b2', 'b3']);
  });
});
