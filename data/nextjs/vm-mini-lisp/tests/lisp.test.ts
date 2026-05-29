import { describe, it, expect } from 'vitest';
import { evalLisp } from '../lib/lisp';

describe('evalLisp', () => {
  it('evaluates integer literals', () => {
    expect(evalLisp('42')).toBe(42);
    expect(evalLisp('-3')).toBe(-3);
  });

  it('evaluates arithmetic with folding', () => {
    expect(evalLisp('(+ 1 2)')).toBe(3);
    expect(evalLisp('(- 10 3 2)')).toBe(5);
    expect(evalLisp('(* 2 3 4)')).toBe(24);
    expect(evalLisp('(/ 100 5 2)')).toBe(10);
  });

  it('handles nested arithmetic', () => {
    expect(evalLisp('(+ (* 2 3) (- 10 4))')).toBe(12);
  });

  it('evaluates comparisons to booleans', () => {
    expect(evalLisp('(< 1 2)')).toBe(true);
    expect(evalLisp('(> 1 2)')).toBe(false);
    expect(evalLisp('(= 3 3)')).toBe(true);
  });

  it('evaluates if expressions', () => {
    expect(evalLisp('(if (< 1 2) 10 20)')).toBe(10);
    expect(evalLisp('(if (> 1 2) 10 20)')).toBe(20);
  });

  it('binds and resolves let variables', () => {
    expect(evalLisp('(let ((x 1) (y 2)) (+ x y))')).toBe(3);
  });

  it('evaluates let binding values in the outer scope', () => {
    // inner x should be 1 (outer), not refer to the new binding mid-list
    expect(evalLisp('(let ((x 5)) (let ((x 10) (y x)) (+ x y)))')).toBe(15);
  });

  it('supports nested let with shadowing', () => {
    expect(evalLisp('(let ((x 1)) (let ((x 2)) x))')).toBe(2);
    expect(evalLisp('(let ((x 1)) (+ x (let ((x 2)) x)))')).toBe(3);
  });

  it('combines if, let, and arithmetic', () => {
    expect(evalLisp('(let ((n 5)) (if (= n 5) (* n 2) 0))')).toBe(10);
  });

  it('throws on unbalanced parentheses', () => {
    expect(() => evalLisp('(+ 1 2')).toThrow();
    expect(() => evalLisp('(+ 1 2))')).toThrow();
  });

  it('throws on unbound symbols and unknown functions', () => {
    expect(() => evalLisp('x')).toThrow();
    expect(() => evalLisp('(foo 1 2)')).toThrow();
  });

  it('throws on division by zero and bad arity', () => {
    expect(() => evalLisp('(/ 1 0)')).toThrow();
    expect(() => evalLisp('(if (< 1 2) 1)')).toThrow();
  });
});
