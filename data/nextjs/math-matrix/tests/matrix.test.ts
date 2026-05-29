import { describe, it, expect } from 'vitest';
import { multiply, transpose, identity, determinant, inverse, Matrix } from '../lib/matrix';

function closeTo(a: Matrix, b: Matrix, eps = 1e-9): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) {
      if (Math.abs(a[i][j] - b[i][j]) > eps) return false;
    }
  }
  return true;
}

describe('matrix', () => {
  it('multiplies compatible matrices', () => {
    const a = [[1, 2], [3, 4]];
    const b = [[5, 6], [7, 8]];
    expect(multiply(a, b)).toEqual([[19, 22], [43, 50]]);
  });

  it('multiplies non-square compatible matrices', () => {
    const a = [[1, 2, 3]]; // 1x3
    const b = [[1], [0], [1]]; // 3x1
    expect(multiply(a, b)).toEqual([[4]]);
  });

  it('throws on inner dimension mismatch', () => {
    expect(() => multiply([[1, 2]], [[1, 2]])).toThrow();
  });

  it('transposes a rectangular matrix', () => {
    expect(transpose([[1, 2, 3], [4, 5, 6]])).toEqual([[1, 4], [2, 5], [3, 6]]);
  });

  it('builds identity and validates size', () => {
    expect(identity(3)).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    expect(() => identity(0)).toThrow();
    expect(() => identity(2.5)).toThrow();
  });

  it('computes 2x2 determinant', () => {
    expect(determinant([[1, 2], [3, 4]])).toBeCloseTo(-2);
    expect(determinant([[7]])).toBeCloseTo(7);
  });

  it('computes 3x3 determinant', () => {
    expect(determinant([[6, 1, 1], [4, -2, 5], [2, 8, 7]])).toBeCloseTo(-306);
  });

  it('determinant of singular matrix is 0', () => {
    expect(determinant([[1, 2], [2, 4]])).toBeCloseTo(0);
  });

  it('throws on non-square determinant', () => {
    expect(() => determinant([[1, 2, 3], [4, 5, 6]])).toThrow();
  });

  it('inverts a 2x2 matrix (round-trip to identity)', () => {
    const m = [[4, 7], [2, 6]];
    const inv = inverse(m);
    expect(inv).not.toBeNull();
    expect(closeTo(multiply(m, inv as Matrix), identity(2))).toBe(true);
  });

  it('inverts a 3x3 matrix (round-trip to identity)', () => {
    const m = [[2, 1, 1], [1, 3, 2], [1, 0, 0]];
    const inv = inverse(m);
    expect(inv).not.toBeNull();
    expect(closeTo(multiply(inv as Matrix, m), identity(3))).toBe(true);
  });

  it('returns null for a singular matrix', () => {
    expect(inverse([[1, 2], [2, 4]])).toBeNull();
  });

  it('does not mutate inputs', () => {
    const m = [[1, 2], [3, 4]];
    const copy = m.map((r) => r.slice());
    determinant(m);
    inverse(m);
    expect(m).toEqual(copy);
  });
});
