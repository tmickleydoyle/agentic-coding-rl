export type Graph = Record<string, Array<[string, number]>>;

export function dijkstra(
  graph: Graph,
  start: string,
): { dist: Record<string, number>; prev: Record<string, string | null> } {
  const dist: Record<string, number> = { [start]: 0 };
  const prev: Record<string, string | null> = { [start]: null };
  const visited = new Set<string>();

  // Simple array-based priority selection (fine for the task scale, and avoids
  // pulling in a heap dependency). Picks the unvisited node with smallest dist.
  while (true) {
    let u: string | null = null;
    let best = Infinity;
    const keys = Object.keys(dist);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (visited.has(k)) continue;
      const d = dist[k];
      if (d < best) {
        best = d;
        u = k;
      }
    }
    if (u === null) break;
    visited.add(u);

    const edges = graph[u] ?? [];
    for (let i = 0; i < edges.length; i++) {
      const v = edges[i][0];
      const w = edges[i][1];
      if (visited.has(v)) continue;
      const nd = best + w;
      const cur = Object.prototype.hasOwnProperty.call(dist, v) ? dist[v] : Infinity;
      if (nd < cur) {
        dist[v] = nd;
        prev[v] = u;
      }
    }
  }

  return { dist, prev };
}

export function shortestPath(graph: Graph, start: string, end: string): string[] {
  const { dist, prev } = dijkstra(graph, start);
  if (!Object.prototype.hasOwnProperty.call(dist, end)) return [];
  const path: string[] = [];
  let cur: string | null = end;
  while (cur !== null) {
    path.push(cur);
    cur = Object.prototype.hasOwnProperty.call(prev, cur) ? prev[cur] : null;
  }
  path.reverse();
  return path;
}
