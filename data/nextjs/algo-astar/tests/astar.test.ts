import { describe, it, expect } from 'vitest';
import { aStar, type Cell } from '../lib/astar';

function isContiguous(path: Cell[]): boolean {
  for (let i = 1; i < path.length; i++) {
    const dr = Math.abs(path[i][0] - path[i - 1][0]);
    const dc = Math.abs(path[i][1] - path[i - 1][1]);
    if (dr + dc !== 1) return false;
  }
  return true;
}

describe('aStar', () => {
  it('finds a straight path on an open grid', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const path = aStar(grid, [0, 0], [0, 2]);
    expect(path).not.toBeNull();
    expect(path!.length).toBe(3); // manhattan(2) + 1
    expect(path![0]).toEqual([0, 0]);
    expect(path![path!.length - 1]).toEqual([0, 2]);
    expect(isContiguous(path!)).toBe(true);
  });

  it('returns optimal length on a diagonal target', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const path = aStar(grid, [0, 0], [2, 2]);
    expect(path).not.toBeNull();
    expect(path!.length).toBe(5); // manhattan(4) + 1
    expect(isContiguous(path!)).toBe(true);
  });

  it('routes around an obstacle, staying optimal', () => {
    // a wall column with a gap forces a detour
    const grid = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    const path = aStar(grid, [0, 0], [0, 2]);
    expect(path).not.toBeNull();
    // must go down to row 2 and back up: 6 steps -> 7 cells
    expect(path!.length).toBe(7);
    expect(isContiguous(path!)).toBe(true);
    path!.forEach(([r, c]) => expect(grid[r][c]).toBe(0));
  });

  it('returns null when the goal is walled off', () => {
    const grid = [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ];
    expect(aStar(grid, [0, 0], [0, 2])).toBeNull();
  });

  it('returns [start] when start equals goal', () => {
    const grid = [
      [0, 0],
      [0, 0],
    ];
    expect(aStar(grid, [1, 1], [1, 1])).toEqual([[1, 1]]);
  });

  it('returns null when start is a wall', () => {
    const grid = [
      [1, 0],
      [0, 0],
    ];
    expect(aStar(grid, [0, 0], [1, 1])).toBeNull();
  });

  it('returns null when goal is a wall', () => {
    const grid = [
      [0, 0],
      [0, 1],
    ];
    expect(aStar(grid, [0, 0], [1, 1])).toBeNull();
  });

  it('returns null for out-of-bounds endpoints', () => {
    const grid = [
      [0, 0],
      [0, 0],
    ];
    expect(aStar(grid, [0, 0], [5, 5])).toBeNull();
    expect(aStar(grid, [-1, 0], [1, 1])).toBeNull();
  });

  it('returns null for an empty grid', () => {
    expect(aStar([], [0, 0], [0, 0])).toBeNull();
  });

  it('navigates a larger maze optimally', () => {
    const grid = [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ];
    const path = aStar(grid, [0, 0], [4, 4]);
    expect(path).not.toBeNull();
    expect(isContiguous(path!)).toBe(true);
    expect(path![0]).toEqual([0, 0]);
    expect(path![path!.length - 1]).toEqual([4, 4]);
    // The only route snakes through the gaps; minimal cell count is 17.
    expect(path!.length).toBe(17);
    path!.forEach(([r, c]) => expect(grid[r][c]).toBe(0));
  });

  it('does not mutate the grid', () => {
    const grid = [
      [0, 0],
      [0, 0],
    ];
    aStar(grid, [0, 0], [1, 1]);
    expect(grid).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });
});
