# Topological sort

Implement a topological sort in `lib/topo-sort.ts`.

```ts
export function topoSort(edges: Array<[string, string]>): string[];
```

`edges` is a list of directed dependency edges `[from, to]` meaning `from` must come
before `to`. The set of nodes is exactly the set of strings appearing in any edge
(both endpoints).

Behavior:

- Returns an array containing every node exactly once, in a valid topological order:
  for every edge `[u, v]`, `u` appears before `v` in the result.
- Isolated relationships and multiple independent chains are all included.
- Throws `new Error('cycle')` if the graph contains a directed cycle (including a
  self-edge `[x, x]`).
- The order must be deterministic for a given input. Use Kahn's algorithm and, among
  nodes that are simultaneously ready (in-degree 0), emit them in the order they were
  first seen while scanning `edges` left to right (then by endpoint within an edge,
  `from` before `to`). Duplicate edges are allowed and do not affect the result beyond
  ordering of first appearance.

Export `topoSort` as a named export.
