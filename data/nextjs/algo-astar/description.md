# A* pathfinding on a grid

Implement A* search on a 2-D grid in `lib/astar.ts`.

```ts
export type Cell = [number, number]; // [row, col]

export function aStar(
  grid: number[][],
  start: Cell,
  goal: Cell,
): Cell[] | null;
```

`grid` is a rectangular matrix where `0` = free cell and `1` = wall. Movement is
**4-directional** (up/down/left/right), each step costs `1`, and the heuristic is the
**Manhattan distance** to the goal.

`aStar(grid, start, goal)`:

- Returns the shortest path as an array of `[row, col]` cells **including both the
  start and goal**, in order from start to goal.
- The returned path length must be **optimal** (minimum number of steps). Its length in
  cells equals `manhattan + 1` when there are no obstacles in the way.
- Returns `null` if the goal is unreachable (walled off or off-grid), if start or goal
  is a wall, or if start/goal lie outside the grid.
- When `start` equals `goal` (and is free / in-bounds), returns `[start]`.
- An empty grid (`[]`) yields `null`.

You may assume `grid` rows all have the same length. Coordinates are `[row, col]` with
row indexing the outer array. Do not mutate `grid`.

Export `aStar` and the `Cell` type as named exports.
