# Minesweeper reveal

Implement Minesweeper reveal logic in `lib/minesweeper.ts`.

```ts
export type Cell =
  | { state: 'hidden' }
  | { state: 'revealed'; adjacent: number }
  | { state: 'mine' };

export interface Board {
  mines: boolean[][];   // true = a mine is at that cell
  cells: Cell[][];      // visible state, same dimensions as `mines`
}

export function countAdjacent(mines: boolean[][], r: number, c: number): number;
export function reveal(board: Board, r: number, c: number): Board;
```

A board is rectangular. `mines[r][c]` marks where mines are; `cells[r][c]` is the
player-visible state, initially all `{ state: 'hidden' }`.

## `countAdjacent(mines, r, c)`

Return the number of mines in the up-to-8 neighbors (orthogonal + diagonal) of
`(r, c)`. Out-of-bounds neighbors don't count. The cell `(r, c)` itself is not
counted.

## `reveal(board, r, c)`

Return a **new** `Board` (do not mutate the input or its nested arrays/cells)
with cell `(r, c)` revealed:

- If `(r, c)` is a mine: that cell becomes `{ state: 'mine' }` (game over —
  reveal only that cell).
- Otherwise the cell becomes `{ state: 'revealed', adjacent }` where `adjacent`
  is `countAdjacent`.
  - If `adjacent === 0`, **flood-fill**: recursively reveal every neighboring
    non-mine cell, continuing to expand through any further `0`-adjacent cells.
    The flood stops at cells whose `adjacent > 0` (those are revealed with their
    number but do not expand further). Mines are never revealed by the flood.
- Revealing an already-revealed or already-mine cell, or one out of bounds,
  throws `Error`. (A `hidden` cell is the only legal target.)

`countAdjacent`, `reveal`, and the types are named exports.
