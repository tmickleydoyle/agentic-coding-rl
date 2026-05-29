import { describe, it, expect } from 'vitest';
import { deepClone } from '../lib/deep-clone';

describe('deepClone', () => {
  it('returns primitives as-is', () => {
    expect(deepClone(5)).toBe(5);
    expect(deepClone('hi')).toBe('hi');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('clones a flat object with equal values', () => {
    const src = { a: 1, b: 'x' };
    const out = deepClone(src);
    expect(out).toEqual(src);
    expect(out).not.toBe(src);
  });

  it('clones a flat array with equal values', () => {
    const src = [1, 2, 3];
    const out = deepClone(src);
    expect(out).toEqual(src);
    expect(out).not.toBe(src);
  });

  it('produces independent nested objects', () => {
    const src = { a: { b: 1 } };
    const out = deepClone(src);
    out.a.b = 99;
    expect(src.a.b).toBe(1);
    expect(out.a).not.toBe(src.a);
  });

  it('produces independent nested arrays', () => {
    const src = { list: [1, [2, 3]] };
    const out = deepClone(src);
    (out.list[1] as number[])[0] = 99;
    expect((src.list[1] as number[])[0]).toBe(2);
  });

  it('mutating the original does not affect the clone', () => {
    const src = { a: [1, 2] };
    const out = deepClone(src);
    src.a.push(3);
    expect(out.a).toEqual([1, 2]);
  });

  it('clones deeply nested mixed structures', () => {
    const src = { a: [{ b: { c: [1, 2] } }] };
    const out = deepClone(src);
    expect(out).toEqual(src);
    expect(out.a[0].b.c).not.toBe(src.a[0].b.c);
  });
});
