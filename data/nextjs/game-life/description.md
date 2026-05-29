# Conway's Game of Life

Implement Conway's Game of Life on a finite grid in `lib/life.ts`.

```ts
export function step(grid: number[][]): number[][];
export function stepN(grid: number[][], n: number): number[][];
```

A grid is a rectangular 2D array of `0` (dead) and `1` (alive) cells.

## Rules

Each cell's next state depends on its 8 neighbors (orthogonal + diagonal). The
grid is **finite**: neighbors outside the grid are treated as dead (no
wrap-around / toroidal behavior).

- A live cell with 2 or 3 live neighbors survives; otherwise it dies.
- A dead cell with exactly 3 live neighbors becomes alive; otherwise stays dead.

## `step(grid)`

Return a **new** grid (same dimensions) representing the next generation.
Do not mutate the input. An empty grid (`[]`) returns `[]`.

## `stepN(grid, n)`

Apply `step` `n` times and return the result. `n === 0` returns a copy of the
input unchanged. `n` is a non-negative integer; throw `Error` if `n < 0` or `n`
is not an integer.

Both are named exports.
