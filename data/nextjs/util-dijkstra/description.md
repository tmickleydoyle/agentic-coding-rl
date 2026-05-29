# Dijkstra shortest paths

Implement Dijkstra's single-source shortest-path algorithm in `lib/dijkstra.ts`.

```ts
export type Graph = Record<string, Array<[string, number]>>;

export function dijkstra(
  graph: Graph,
  start: string,
): { dist: Record<string, number>; prev: Record<string, string | null> };

export function shortestPath(graph: Graph, start: string, end: string): string[];
```

The graph is an adjacency list: `graph[u]` is a list of `[v, weight]` edges from `u`
to `v`. All weights are non-negative. Edges are directed (include both directions for
an undirected graph). A node may appear only as a neighbor and not as a key.

`dijkstra(graph, start)`:

- Returns `dist`, mapping every reachable node to its minimum total distance from
  `start`. `start` has distance `0`. Unreachable nodes are NOT included in `dist`.
- Returns `prev`, mapping every reachable node to the previous node on a shortest path
  from `start` (the predecessor). `prev[start]` is `null`. Unreachable nodes are not
  included in `prev`.
- When multiple shortest paths tie, the chosen predecessor is the one found first
  while relaxing edges (deterministic for a given input).
- A node with a self-loop must not loop forever; the distance to `start` stays `0`.

`shortestPath(graph, start, end)`:

- Returns the list of nodes from `start` to `end` (inclusive) along a shortest path.
- Returns `[start]` when `start === end`.
- Returns `[]` when `end` is unreachable from `start`.

Export `dijkstra`, `shortestPath`, and the `Graph` type as named exports.
