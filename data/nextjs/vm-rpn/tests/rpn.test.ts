import { describe, it, expect } from 'vitest';
import { evalRPN, infixToRPN } from '../lib/rpn';

describe('evalRPN', () => {
  it('evaluates a simple addition', () => {
    expect(evalRPN(['3', '4', '+'])).toBe(7);
  });

  it('respects operand order for subtraction and division', () => {
    expect(evalRPN(['10', '3', '-'])).toBe(7);
    expect(evalRPN(['12', '4', '/'])).toBe(3);
  });

  it('evaluates a multi-operator expression', () => {
    // (3 + 4) * 2 - 5 = 9
    expect(evalRPN(['3', '4', '+', '2', '*', '5', '-'])).toBe(9);
  });

  it('supports unary neg and negative literals', () => {
    expect(evalRPN(['5', 'neg'])).toBe(-5);
    expect(evalRPN(['-2', '3', '*'])).toBe(-6);
  });

  it('throws on stack underflow for a binary op', () => {
    expect(() => evalRPN(['1', '+'])).toThrow();
    expect(() => evalRPN(['neg'])).toThrow();
  });

  it('throws on division by zero', () => {
    expect(() => evalRPN(['1', '0', '/'])).toThrow();
  });

  it('throws on unknown tokens', () => {
    expect(() => evalRPN(['1', '2', '%'])).toThrow();
  });

  it('throws on leftover values or empty input', () => {
    expect(() => evalRPN(['1', '2'])).toThrow();
    expect(() => evalRPN([])).toThrow();
  });
});

describe('infixToRPN', () => {
  it('converts respecting precedence', () => {
    expect(infixToRPN('3 + 4 * 2')).toEqual(['3', '4', '2', '*', '+']);
  });

  it('handles parentheses', () => {
    expect(infixToRPN('( 3 + 4 ) * 2')).toEqual(['3', '4', '+', '2', '*']);
  });

  it('round-trips through evalRPN', () => {
    expect(evalRPN(infixToRPN('( 3 + 4 ) * 2 - 5'))).toBe(9);
    expect(evalRPN(infixToRPN('2 + 3 * 4 - 1'))).toBe(13);
  });

  it('throws on mismatched parentheses', () => {
    expect(() => infixToRPN('( 3 + 4')).toThrow();
    expect(() => infixToRPN('3 + 4 )')).toThrow();
  });
});
