import { describe, it, expect } from 'vitest';
import { pipe, compose } from '../lib/pipe';

const inc = (n: number) => n + 1;
const double = (n: number) => n * 2;

describe('pipe', () => {
  it('applies functions left to right', () => {
    // (3 + 1) * 2 = 8
    expect(pipe(inc, double)(3)).toBe(8);
  });

  it('empty pipe is identity', () => {
    expect(pipe()(42)).toBe(42);
  });

  it('single function behaves like that function', () => {
    expect(pipe(inc)(10)).toBe(11);
  });

  it('chains three functions left to right', () => {
    // ((1+1)*2)+1 = 5
    expect(pipe(inc, double, inc)(1)).toBe(5);
  });
});

describe('compose', () => {
  it('applies functions right to left', () => {
    // (3 * 2) + 1 = 7
    expect(compose(inc, double)(3)).toBe(7);
  });

  it('empty compose is identity', () => {
    expect(compose()(42)).toBe(42);
  });

  it('single function behaves like that function', () => {
    expect(compose(double)(10)).toBe(20);
  });

  it('is the reverse of pipe for the same functions', () => {
    expect(compose(inc, double)(3)).toBe(pipe(double, inc)(3));
  });
});
