# 2048 move logic

Implement deterministic 2048 board logic in `lib/g2048.ts` (no random spawns).

```ts
export type Dir = 'L' | 'R' | 'U' | 'D';

export function slide(row: number[]): number[];

export function move(
  grid: number[][],
  dir: Dir,
): { grid: number[][]; gained: number };
```

Tiles are positive numbers; `0` is an empty slot.

## `slide(row)`

Slide and merge a single row to the **left**:

1. Drop all zeros (compact non-zero tiles toward the left, preserving order).
2. Scan left-to-right merging equal adjacent tiles: two equal tiles combine into
   one tile of double the value. Each tile may participate in **at most one
   merge** per call (so `[2,2,2,2] -> [4,4]` before padding, not `[8]` or
   `[4,2,2]`).
3. Pad the result back to the original length with trailing zeros.

Return a new array; do not mutate the input. Examples:
`[2,2,2,2] -> [4,4,0,0]`, `[2,0,2,4] -> [4,4,0,0]`,
`[4,4,8,8] -> [8,16,0,0]`, `[2,2,2,0] -> [4,2,0,0]`.

## `move(grid, dir)`

Apply a move in direction `dir` to a square `n x n` grid by reducing each line
with `slide`:

- `'L'`: slide each row as-is.
- `'R'`: reverse each row, slide, reverse back.
- `'U'`: slide each column (top is the "left" end).
- `'D'`: slide each column from the bottom.

Return `{ grid, gained }` where `grid` is the resulting board (new arrays, input
not mutated) and `gained` is the total points scored this move — the **sum of
the values of every newly-created merged tile** (e.g. merging two `2`s yields a
`4`, adding `4` to `gained`).

Both functions and the `Dir` type are named exports.
