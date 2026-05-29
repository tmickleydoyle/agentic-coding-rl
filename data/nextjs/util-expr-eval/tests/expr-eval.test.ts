import { describe, it, expect } from 'vitest';
import { evaluate } from '../lib/expr-eval';

describe('evaluate', () => {
  it('evaluates a single number', () => {
    expect(evaluate('42')).toBe(42);
    expect(evaluate('3.5')).toBe(3.5);
    expect(evaluate('.5')).toBe(0.5);
  });

  it('respects multiplication over addition precedence', () => {
    expect(evaluate('2 + 3 * 4')).toBe(14);
    expect(evaluate('2 * 3 + 4')).toBe(10);
  });

  it('honors parentheses', () => {
    expect(evaluate('(2 + 3) * 4')).toBe(20);
    expect(evaluate('2 * (3 + (4 - 1))')).toBe(12);
  });

  it('is left associative for subtraction and division', () => {
    expect(evaluate('10 - 3 - 2')).toBe(5);
    expect(evaluate('100 / 5 / 2')).toBe(10);
  });

  it('handles unary minus', () => {
    expect(evaluate('-3')).toBe(-3);
    expect(evaluate('4 * -2')).toBe(-8);
    expect(evaluate('-(1 + 2)')).toBe(-3);
    expect(evaluate('- -5')).toBe(5);
  });

  it('ignores whitespace', () => {
    expect(evaluate('  1   +    2  ')).toBe(3);
  });

  it('handles decimals in operations', () => {
    expect(evaluate('1.5 * 2')).toBe(3);
    expect(evaluate('0.1 + 0.2')).toBeCloseTo(0.3, 10);
  });

  it('throws on an empty or whitespace-only string', () => {
    expect(() => evaluate('')).toThrow();
    expect(() => evaluate('   ')).toThrow();
  });

  it('throws on unbalanced parentheses', () => {
    expect(() => evaluate('(1 + 2')).toThrow();
    expect(() => evaluate('1 + 2)')).toThrow();
  });

  it('throws on a missing operand', () => {
    expect(() => evaluate('1 +')).toThrow();
    expect(() => evaluate('* 3')).toThrow();
  });

  it('throws on division by zero', () => {
    expect(() => evaluate('1 / 0')).toThrow();
    expect(() => evaluate('5 / (3 - 3)')).toThrow();
  });

  it('throws on unknown characters and malformed numbers', () => {
    expect(() => evaluate('2 $ 3')).toThrow();
    expect(() => evaluate('1.2.3')).toThrow();
  });
});
