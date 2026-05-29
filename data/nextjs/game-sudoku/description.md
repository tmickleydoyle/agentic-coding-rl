# Sudoku validity + solver

Implement Sudoku helpers in `lib/sudoku.ts`.

```ts
export function isValid(board: number[][]): boolean;
export function findConflicts(board: number[][]): Array<[number, number]>;
export function solve(board: number[][]): number[][] | null;
```

A board is a `9 x 9` grid. Each cell is `0` (blank) or `1..9`. You may assume
the input is `9 x 9` with values in `0..9`.

## `isValid(board)`

Return `true` iff the board has no duplicate non-zero value within any row, any
column, or any of the nine `3 x 3` boxes. Blanks (`0`) never conflict. A fully
blank board is valid.

## `findConflicts(board)`

Return the coordinates `[row, col]` of every filled cell that participates in at
least one conflict (its value duplicates another non-zero value in its row,
column, or box). Order: ascending by row, then by column. Each coordinate
appears at most once. Returns `[]` when the board is valid.

## `solve(board)`

Return a solved copy of the board (every cell `1..9`, fully valid) using
backtracking, **without mutating the input**. If the board is unsolvable (or
already invalid), return `null`. Pre-filled cells must be preserved.

All three are named exports.
