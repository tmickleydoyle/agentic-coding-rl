import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '../lib/roman';

describe('roman', () => {
  it('converts basic values to roman', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(90)).toBe('XC');
  });

  it('converts composite values', () => {
    expect(toRoman(1994)).toBe('MCMXCIV');
    expect(toRoman(2023)).toBe('MMXXIII');
    expect(toRoman(3999)).toBe('MMMCMXCIX');
    expect(toRoman(3888)).toBe('MMMDCCCLXXXVIII');
  });

  it('toRoman validates range', () => {
    expect(() => toRoman(0)).toThrow();
    expect(() => toRoman(4000)).toThrow();
    expect(() => toRoman(-5)).toThrow();
    expect(() => toRoman(1.5)).toThrow();
  });

  it('parses valid numerals', () => {
    expect(fromRoman('IV')).toBe(4);
    expect(fromRoman('MCMXCIV')).toBe(1994);
    expect(fromRoman('MMMCMXCIX')).toBe(3999);
  });

  it('round-trips a sampling of 1..3999', () => {
    for (let n = 1; n <= 3999; n += 7) {
      expect(fromRoman(toRoman(n))).toBe(n);
    }
    expect(fromRoman(toRoman(3999))).toBe(3999);
  });

  it('rejects four repeated symbols', () => {
    expect(() => fromRoman('IIII')).toThrow();
    expect(() => fromRoman('XXXX')).toThrow();
    expect(() => fromRoman('MMMM')).toThrow();
  });

  it('rejects repeated V, L, D', () => {
    expect(() => fromRoman('VV')).toThrow();
    expect(() => fromRoman('LL')).toThrow();
    expect(() => fromRoman('DD')).toThrow();
  });

  it('rejects invalid subtractive pairs', () => {
    expect(() => fromRoman('IC')).toThrow();
    expect(() => fromRoman('IL')).toThrow();
    expect(() => fromRoman('VX')).toThrow();
  });

  it('rejects empty and non-roman characters', () => {
    expect(() => fromRoman('')).toThrow();
    expect(() => fromRoman('ABC')).toThrow();
    expect(() => fromRoman('iv')).toThrow();
  });

  it('rejects non-canonical orderings', () => {
    expect(() => fromRoman('IXX')).toThrow();
    expect(() => fromRoman('VIV')).toThrow();
  });
});
