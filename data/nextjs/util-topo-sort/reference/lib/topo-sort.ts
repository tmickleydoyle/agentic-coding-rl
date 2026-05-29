export function topoSort(edges: Array<[string, string]>): string[] {
  const order: string[] = []; // first-seen order of nodes
  const seen = new Set<string>();
  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();

  const see = (n: string): void => {
    if (!seen.has(n)) {
      seen.add(n);
      order.push(n);
      adj.set(n, []);
      indeg.set(n, 0);
    }
  };

  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    see(u);
    see(v);
    (adj.get(u) as string[]).push(v);
    indeg.set(v, (indeg.get(v) as number) + 1);
  }

  // Ready queue holds in-degree-0 nodes; we always pick the earliest first-seen one
  // to keep determinism.
  const ready: string[] = [];
  for (let i = 0; i < order.length; i++) {
    const n = order[i];
    if ((indeg.get(n) as number) === 0) ready.push(n);
  }

  const result: string[] = [];
  while (ready.length > 0) {
    // pick the node with the smallest first-seen index among ready
    let bestIdx = 0;
    let bestPos = order.indexOf(ready[0]);
    for (let i = 1; i < ready.length; i++) {
      const pos = order.indexOf(ready[i]);
      if (pos < bestPos) {
        bestPos = pos;
        bestIdx = i;
      }
    }
    const n = ready.splice(bestIdx, 1)[0];
    result.push(n);

    const outs = adj.get(n) as string[];
    for (let i = 0; i < outs.length; i++) {
      const v = outs[i];
      const d = (indeg.get(v) as number) - 1;
      indeg.set(v, d);
      if (d === 0) ready.push(v);
    }
  }

  if (result.length !== order.length) {
    throw new Error('cycle');
  }
  return result;
}
