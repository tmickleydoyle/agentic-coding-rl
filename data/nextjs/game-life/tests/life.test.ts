import { describe, it, expect } from 'vitest';
import { step, stepN } from '../lib/life';

describe('Game of Life', () => {
  it('keeps a block still-life unchanged', () => {
    const block = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    expect(step(block)).toEqual(block);
  });

  it('oscillates a blinker between horizontal and vertical', () => {
    const horizontal = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
    const vertical = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    expect(step(horizontal)).toEqual(vertical);
    expect(step(vertical)).toEqual(horizontal);
  });

  it('kills a lone live cell (underpopulation)', () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    expect(step(grid)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('kills overpopulated cells', () => {
    const grid = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    // center has 8 neighbors -> dies
    expect(step(grid)[1][1]).toBe(0);
  });

  it('births a dead cell with exactly 3 neighbors', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(step(grid)[1][1]).toBe(1);
  });

  it('treats out-of-bounds neighbors as dead at edges', () => {
    // corner block at top-left should survive as a still life
    const grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ];
    expect(step(grid)).toEqual(grid);
  });

  it('does not mutate the input grid', () => {
    const grid = [
      [1, 1],
      [0, 0],
    ];
    const copy = grid.map((r) => r.slice());
    step(grid);
    expect(grid).toEqual(copy);
  });

  it('returns [] for an empty grid', () => {
    expect(step([])).toEqual([]);
  });

  it('stepN(0) returns an unchanged copy', () => {
    const grid = [
      [1, 0],
      [0, 1],
    ];
    const out = stepN(grid, 0);
    expect(out).toEqual(grid);
    expect(out).not.toBe(grid);
  });

  it('stepN applies multiple generations (blinker period 2)', () => {
    const horizontal = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
    expect(stepN(horizontal, 2)).toEqual(horizontal);
  });

  it('throws on a negative or non-integer n', () => {
    expect(() => stepN([[1]], -1)).toThrow();
    expect(() => stepN([[1]], 1.5)).toThrow();
  });
});
