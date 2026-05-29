import { describe, it, expect } from 'vitest';
import { countAdjacent, reveal, type Board, type Cell } from '../lib/minesweeper';

function freshBoard(mines: boolean[][]): Board {
  const cells: Cell[][] = mines.map((row) => row.map(() => ({ state: 'hidden' as const })));
  return { mines, cells };
}

describe('countAdjacent', () => {
  it('counts surrounding mines', () => {
    const mines = [
      [true, false, false],
      [false, false, false],
      [false, false, true],
    ];
    expect(countAdjacent(mines, 1, 1)).toBe(2);
  });

  it('ignores out-of-bounds neighbors at a corner', () => {
    const mines = [
      [false, true],
      [true, true],
    ];
    expect(countAdjacent(mines, 0, 0)).toBe(3);
  });

  it('does not count the cell itself', () => {
    const mines = [
      [true, false],
      [false, false],
    ];
    expect(countAdjacent(mines, 0, 0)).toBe(0);
  });
});

describe('reveal', () => {
  it('reveals a number cell with its adjacent count', () => {
    const board = freshBoard([
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    const out = reveal(board, 0, 1);
    expect(out.cells[0][1]).toEqual({ state: 'revealed', adjacent: 1 });
  });

  it('flood-fills a region of zero cells and borders with numbers', () => {
    // mine only at bottom-right; revealing top-left opens most of the board
    const board = freshBoard([
      [false, false, false],
      [false, false, false],
      [false, false, true],
    ]);
    const out = reveal(board, 0, 0);
    // top-left has 0 adjacent and floods outward
    expect(out.cells[0][0]).toEqual({ state: 'revealed', adjacent: 0 });
    // the three cells adjacent to the mine get numbers but the mine stays hidden
    expect(out.cells[1][1]).toEqual({ state: 'revealed', adjacent: 1 });
    expect(out.cells[1][2]).toEqual({ state: 'revealed', adjacent: 1 });
    expect(out.cells[2][1]).toEqual({ state: 'revealed', adjacent: 1 });
    expect(out.cells[2][2]).toEqual({ state: 'hidden' });
  });

  it('does not reveal mines during a flood', () => {
    const board = freshBoard([
      [false, false, false],
      [false, false, false],
      [false, false, true],
    ]);
    const out = reveal(board, 0, 0);
    let mineRevealed = false;
    out.cells.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        if (board.mines[ri][ci] && cell.state !== 'hidden') mineRevealed = true;
      }),
    );
    expect(mineRevealed).toBe(false);
  });

  it('reveals only the clicked cell when it has a positive count', () => {
    const board = freshBoard([
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    const out = reveal(board, 1, 1);
    expect(out.cells[1][1]).toEqual({ state: 'revealed', adjacent: 1 });
    // neighbors stay hidden because the clicked cell had a non-zero count
    expect(out.cells[0][1]).toEqual({ state: 'hidden' });
    expect(out.cells[2][2]).toEqual({ state: 'hidden' });
  });

  it('hitting a mine ends the game revealing just that cell', () => {
    const board = freshBoard([
      [true, false],
      [false, false],
    ]);
    const out = reveal(board, 0, 0);
    expect(out.cells[0][0]).toEqual({ state: 'mine' });
    expect(out.cells[0][1]).toEqual({ state: 'hidden' });
    expect(out.cells[1][0]).toEqual({ state: 'hidden' });
  });

  it('does not mutate the input board', () => {
    const board = freshBoard([
      [false, false],
      [false, false],
    ]);
    reveal(board, 0, 0);
    expect(board.cells[0][0]).toEqual({ state: 'hidden' });
  });

  it('throws when revealing an already-revealed cell', () => {
    const board = freshBoard([
      [true, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    const out = reveal(board, 1, 1);
    expect(() => reveal(out, 1, 1)).toThrow();
  });

  it('throws on out-of-bounds coordinates', () => {
    const board = freshBoard([
      [false, false],
      [false, false],
    ]);
    expect(() => reveal(board, 5, 0)).toThrow();
    expect(() => reveal(board, 0, -1)).toThrow();
  });
});
