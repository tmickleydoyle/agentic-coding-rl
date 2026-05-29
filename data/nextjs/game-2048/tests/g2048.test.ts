import { describe, it, expect } from 'vitest';
import { slide, move } from '../lib/g2048';

describe('slide', () => {
  it('compacts toward the left', () => {
    expect(slide([0, 2, 0, 4])).toEqual([2, 4, 0, 0]);
  });

  it('merges a pair', () => {
    expect(slide([2, 2, 0, 0])).toEqual([4, 0, 0, 0]);
  });

  it('merges two independent pairs (one merge per tile)', () => {
    expect(slide([2, 2, 2, 2])).toEqual([4, 4, 0, 0]);
  });

  it('does not cascade-merge a freshly merged tile', () => {
    expect(slide([2, 2, 4, 0])).toEqual([4, 4, 0, 0]);
  });

  it('merges the leftmost pair when three equal tiles', () => {
    expect(slide([2, 2, 2, 0])).toEqual([4, 2, 0, 0]);
  });

  it('compacts before merging across gaps', () => {
    expect(slide([2, 0, 2, 4])).toEqual([4, 4, 0, 0]);
  });

  it('handles a full no-merge row', () => {
    expect(slide([2, 4, 8, 16])).toEqual([2, 4, 8, 16]);
  });

  it('does not mutate the input', () => {
    const row = [2, 2, 0, 0];
    slide(row);
    expect(row).toEqual([2, 2, 0, 0]);
  });
});

describe('move', () => {
  it('moves left and reports gained score', () => {
    const grid = [
      [2, 2, 0, 0],
      [4, 0, 4, 0],
      [0, 0, 0, 0],
      [8, 8, 8, 8],
    ];
    const out = move(grid, 'L');
    expect(out.grid).toEqual([
      [4, 0, 0, 0],
      [8, 0, 0, 0],
      [0, 0, 0, 0],
      [16, 16, 0, 0],
    ]);
    expect(out.gained).toBe(4 + 8 + 16 + 16);
  });

  it('moves right by reversing rows', () => {
    const grid = [
      [2, 2, 0, 0],
      [0, 4, 0, 4],
    ].concat([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const out = move(grid, 'R');
    expect(out.grid[0]).toEqual([0, 0, 0, 4]);
    expect(out.grid[1]).toEqual([0, 0, 0, 8]);
    expect(out.gained).toBe(4 + 8);
  });

  it('moves up by sliding columns toward the top', () => {
    const grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ];
    const out = move(grid, 'U');
    const col0 = out.grid.map((row) => row[0]);
    expect(col0).toEqual([4, 8, 0, 0]);
    expect(out.gained).toBe(12);
  });

  it('moves down by sliding columns toward the bottom', () => {
    const grid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ];
    const out = move(grid, 'D');
    const col0 = out.grid.map((row) => row[0]);
    expect(col0).toEqual([0, 0, 4, 8]);
    expect(out.gained).toBe(12);
  });

  it('does not mutate the input grid', () => {
    const grid = [
      [2, 2],
      [0, 0],
    ];
    const before = grid.map((r) => r.slice());
    move(grid, 'L');
    expect(grid).toEqual(before);
  });

  it('reports zero gained when nothing merges', () => {
    const grid = [
      [2, 4],
      [8, 16],
    ];
    expect(move(grid, 'L').gained).toBe(0);
  });
});
