import { describe, it, expect } from 'vitest';
import { isValid, findConflicts, solve } from '../lib/sudoku';

const SOLVED = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

function blankBoard(): number[][] {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
}

describe('isValid', () => {
  it('accepts a fully blank board', () => {
    expect(isValid(blankBoard())).toBe(true);
  });

  it('accepts a complete valid solution', () => {
    expect(isValid(SOLVED)).toBe(true);
  });

  it('rejects a duplicate in a row', () => {
    const b = blankBoard();
    b[0][0] = 5;
    b[0][8] = 5;
    expect(isValid(b)).toBe(false);
  });

  it('rejects a duplicate in a column', () => {
    const b = blankBoard();
    b[0][3] = 7;
    b[8][3] = 7;
    expect(isValid(b)).toBe(false);
  });

  it('rejects a duplicate within a 3x3 box', () => {
    const b = blankBoard();
    b[0][0] = 9;
    b[2][2] = 9;
    expect(isValid(b)).toBe(false);
  });

  it('treats zeros as blanks that never conflict', () => {
    const b = blankBoard();
    b[0][0] = 0;
    b[0][1] = 0;
    expect(isValid(b)).toBe(true);
  });
});

describe('findConflicts', () => {
  it('returns [] for a valid board', () => {
    expect(findConflicts(SOLVED)).toEqual([]);
  });

  it('reports both cells of a row conflict, sorted', () => {
    const b = blankBoard();
    b[3][1] = 4;
    b[3][6] = 4;
    expect(findConflicts(b)).toEqual([
      [3, 1],
      [3, 6],
    ]);
  });

  it('does not duplicate a cell conflicting in multiple groups', () => {
    const b = blankBoard();
    // same value in same row and same box
    b[0][0] = 2;
    b[0][1] = 2;
    const conflicts = findConflicts(b);
    expect(conflicts).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });
});

describe('solve', () => {
  it('solves a near-complete puzzle (one blank)', () => {
    const puzzle = SOLVED.map((row) => row.slice());
    puzzle[0][0] = 0;
    const result = solve(puzzle);
    expect(result).toEqual(SOLVED);
  });

  it('solves a harder puzzle to a valid full board', () => {
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
    const result = solve(puzzle);
    expect(result).not.toBeNull();
    expect(isValid(result as number[][])).toBe(true);
    // every cell filled, prefilled cells preserved
    (result as number[][]).forEach((row, r) =>
      row.forEach((v, c) => {
        expect(v).toBeGreaterThanOrEqual(1);
        if (puzzle[r][c] !== 0) expect(v).toBe(puzzle[r][c]);
      }),
    );
  });

  it('returns null for an already-invalid board', () => {
    const b = blankBoard();
    b[0][0] = 1;
    b[0][1] = 1;
    expect(solve(b)).toBeNull();
  });

  it('does not mutate the input', () => {
    const puzzle = SOLVED.map((row) => row.slice());
    puzzle[0][0] = 0;
    const before = puzzle.map((row) => row.slice());
    solve(puzzle);
    expect(puzzle).toEqual(before);
  });
});
