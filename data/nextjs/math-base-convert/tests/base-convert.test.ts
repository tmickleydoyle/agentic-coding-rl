import { describe, it, expect } from 'vitest';
import { convert } from '../lib/base-convert';

describe('base-convert', () => {
  it('converts decimal to hex', () => {
    expect(convert('255', 10, 16)).toBe('ff');
    expect(convert('16', 10, 16)).toBe('10');
  });

  it('converts hex to binary', () => {
    expect(convert('ff', 16, 2)).toBe('11111111');
    expect(convert('1a', 16, 2)).toBe('11010');
  });

  it('converts binary to hex', () => {
    expect(convert('11111111', 2, 16)).toBe('ff');
  });

  it('is case-insensitive on input, lowercase out', () => {
    expect(convert('FF', 16, 10)).toBe('255');
    expect(convert('Z', 36, 10)).toBe('35');
  });

  it('handles zero in any base', () => {
    expect(convert('0', 10, 2)).toBe('0');
    expect(convert('0', 16, 36)).toBe('0');
    expect(convert('000', 2, 10)).toBe('0');
  });

  it('ignores leading zeros', () => {
    expect(convert('00ff', 16, 10)).toBe('255');
  });

  it('round-trips base36 <-> base10', () => {
    expect(convert('zzz', 36, 10)).toBe('46655');
    expect(convert('46655', 10, 36)).toBe('zzz');
  });

  it('handles very large numbers beyond Number precision', () => {
    const big = '123456789012345678901234567890';
    // hex of that decimal, verified independently
    expect(convert(big, 10, 16)).toBe('18ee90ff6c373e0ee4e3f0ad2');
    // and back
    expect(convert('18ee90ff6c373e0ee4e3f0ad2', 16, 10)).toBe(big);
  });

  it('throws on invalid digit for fromBase', () => {
    expect(() => convert('8', 8, 10)).toThrow();
    expect(() => convert('g', 16, 10)).toThrow();
    expect(() => convert('2', 2, 10)).toThrow();
  });

  it('throws on empty value', () => {
    expect(() => convert('', 10, 2)).toThrow();
  });

  it('throws on out-of-range bases', () => {
    expect(() => convert('1', 1, 10)).toThrow();
    expect(() => convert('1', 10, 37)).toThrow();
    expect(() => convert('1', 10, 2.5)).toThrow();
  });
});
