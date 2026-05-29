export type Graph = Record<string, Array<[string, number]>>;

export function dijkstra(
  graph: Graph,
  start: string,
): { dist: Record<string, number>; prev: Record<string, string | null> } {
  // TODO: implement
  void graph;
  void start;
  throw new Error('not implemented');
}

export function shortestPath(graph: Graph, start: string, end: string): string[] {
  // TODO: implement
  void graph;
  void start;
  void end;
  throw new Error('not implemented');
}
