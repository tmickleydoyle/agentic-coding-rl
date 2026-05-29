import { describe, it, expect } from 'vitest';
import { Fraction } from '../lib/fraction';

describe('Fraction', () => {
  it('auto-reduces on construction', () => {
    const f = new Fraction(2, 4);
    expect(f.num).toBe(1);
    expect(f.den).toBe(2);
  });

  it('normalizes sign onto numerator', () => {
    const f = new Fraction(2, -4);
    expect(f.num).toBe(-1);
    expect(f.den).toBe(2);
    const g = new Fraction(-2, -4);
    expect(g.num).toBe(1);
    expect(g.den).toBe(2);
  });

  it('normalizes zero to 0/1', () => {
    const f = new Fraction(0, -5);
    expect(f.num).toBe(0);
    expect(f.den).toBe(1);
  });

  it('throws on zero denominator', () => {
    expect(() => new Fraction(1, 0)).toThrow();
  });

  it('throws on non-integer args', () => {
    expect(() => new Fraction(1.5, 2)).toThrow();
    expect(() => new Fraction(1, 2.5)).toThrow();
  });

  it('adds and reduces', () => {
    const r = new Fraction(1, 2).add(new Fraction(1, 3));
    expect(r.toString()).toBe('5/6');
    const half = new Fraction(1, 6).add(new Fraction(1, 3));
    expect(half.toString()).toBe('1/2');
  });

  it('subtracts to an integer', () => {
    const r = new Fraction(3, 2).sub(new Fraction(1, 2));
    expect(r.toString()).toBe('1');
    expect(r.den).toBe(1);
  });

  it('multiplies with reduction', () => {
    const r = new Fraction(2, 3).mul(new Fraction(3, 4));
    expect(r.toString()).toBe('1/2');
  });

  it('divides and throws on zero divisor', () => {
    const r = new Fraction(1, 2).div(new Fraction(3, 4));
    expect(r.toString()).toBe('2/3');
    expect(() => new Fraction(1, 2).div(new Fraction(0, 5))).toThrow();
  });

  it('does not mutate operands', () => {
    const a = new Fraction(1, 2);
    const b = new Fraction(1, 3);
    a.add(b);
    expect(a.toString()).toBe('1/2');
    expect(b.toString()).toBe('1/3');
  });

  it('equals compares reduced forms', () => {
    expect(new Fraction(2, 4).equals(new Fraction(1, 2))).toBe(true);
    expect(new Fraction(1, 2).equals(new Fraction(1, 3))).toBe(false);
  });

  it('valueOf enables numeric coercion and arithmetic chains', () => {
    const f = new Fraction(3, 4);
    expect(+f).toBeCloseTo(0.75);
    const chain = new Fraction(1, 2).add(new Fraction(1, 4)).mul(new Fraction(4, 1));
    expect(chain.toString()).toBe('3');
    expect(+chain).toBe(3);
  });

  it('negative integer toString', () => {
    expect(new Fraction(-6, 3).toString()).toBe('-2');
  });
});
