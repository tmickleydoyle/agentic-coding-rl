import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, compare } from '../lib/bignum';

describe('bignum', () => {
  it('adds small numbers', () => {
    expect(add('2', '3')).toBe('5');
    expect(add('19', '1')).toBe('20');
  });

  it('adds very long numbers beyond Number precision', () => {
    const a = '9'.repeat(50);
    const b = '1';
    expect(add(a, b)).toBe('1' + '0'.repeat(50));
  });

  it('add normalizes leading zeros', () => {
    expect(add('007', '003')).toBe('10');
    expect(add('0', '0')).toBe('0');
  });

  it('subtracts with borrows', () => {
    expect(subtract('1000', '1')).toBe('999');
    expect(subtract('100', '100')).toBe('0');
  });

  it('subtract on long numbers', () => {
    const a = '1' + '0'.repeat(40);
    expect(subtract(a, '1')).toBe('9'.repeat(40));
  });

  it('subtract throws when a < b', () => {
    expect(() => subtract('5', '6')).toThrow();
  });

  it('multiplies known large product', () => {
    // 12345678901234567890 * 98765432109876543210
    expect(multiply('12345678901234567890', '98765432109876543210')).toBe(
      '1219326311370217952237463801111263526900'
    );
  });

  it('multiply by zero is zero', () => {
    expect(multiply('0', '99999999999999999999')).toBe('0');
    expect(multiply('123', '0')).toBe('0');
  });

  it('multiply normalizes', () => {
    expect(multiply('0012', '011')).toBe('132');
  });

  it('compare handles leading zeros and magnitude', () => {
    expect(compare('007', '7')).toBe(0);
    expect(compare('100', '99')).toBe(1);
    expect(compare('99', '100')).toBe(-1);
  });

  it('compare on equal-length differing values', () => {
    expect(compare('123', '124')).toBe(-1);
    expect(compare('124', '123')).toBe(1);
  });

  it('throws on invalid input', () => {
    expect(() => add('12', 'x3')).toThrow();
    expect(() => compare('', '1')).toThrow();
    expect(() => multiply('1.5', '2')).toThrow();
  });
});
