export type Cell = [number, number]; // [row, col]

interface PQItem {
  key: number; // encoded cell index
  f: number;
}

// Minimal binary min-heap keyed on f score.
class FHeap {
  private data: PQItem[] = [];

  size(): number {
    return this.data.length;
  }

  push(item: PQItem): void {
    const d = this.data;
    d.push(item);
    let i = d.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (d[i].f < d[p].f) {
        const t = d[i];
        d[i] = d[p];
        d[p] = t;
        i = p;
      } else break;
    }
  }

  pop(): PQItem | undefined {
    const d = this.data;
    if (d.length === 0) return undefined;
    const top = d[0];
    const last = d.pop() as PQItem;
    if (d.length > 0) {
      d[0] = last;
      let i = 0;
      const n = d.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < n && d[l].f < d[s].f) s = l;
        if (r < n && d[r].f < d[s].f) s = r;
        if (s === i) break;
        const t = d[i];
        d[i] = d[s];
        d[s] = t;
        i = s;
      }
    }
    return top;
  }
}

export function aStar(grid: number[][], start: Cell, goal: Cell): Cell[] | null {
  const rows = grid.length;
  if (rows === 0) return null;
  const cols = grid[0].length;
  if (cols === 0) return null;

  const inBounds = (r: number, c: number): boolean =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  const [sr, sc] = start;
  const [gr, gc] = goal;
  if (!inBounds(sr, sc) || !inBounds(gr, gc)) return null;
  if (grid[sr][sc] === 1 || grid[gr][gc] === 1) return null;

  const idx = (r: number, c: number): number => r * cols + c;
  const heuristic = (r: number, c: number): number =>
    Math.abs(r - gr) + Math.abs(c - gc);

  const total = rows * cols;
  const gScore = new Array<number>(total).fill(Infinity);
  const cameFrom = new Array<number>(total).fill(-1);
  const closed = new Array<boolean>(total).fill(false);

  const startKey = idx(sr, sc);
  const goalKey = idx(gr, gc);
  gScore[startKey] = 0;

  const open = new FHeap();
  open.push({ key: startKey, f: heuristic(sr, sc) });

  const dr = [-1, 1, 0, 0];
  const dc = [0, 0, -1, 1];

  while (open.size() > 0) {
    const current = open.pop() as PQItem;
    const ckey = current.key;
    if (closed[ckey]) continue;
    if (ckey === goalKey) break;
    closed[ckey] = true;

    const cr = Math.floor(ckey / cols);
    const cc = ckey % cols;
    const baseG = gScore[ckey];

    for (let k = 0; k < 4; k++) {
      const nr = cr + dr[k];
      const nc = cc + dc[k];
      if (!inBounds(nr, nc) || grid[nr][nc] === 1) continue;
      const nkey = idx(nr, nc);
      if (closed[nkey]) continue;
      const tentative = baseG + 1;
      if (tentative < gScore[nkey]) {
        gScore[nkey] = tentative;
        cameFrom[nkey] = ckey;
        open.push({ key: nkey, f: tentative + heuristic(nr, nc) });
      }
    }
  }

  if (gScore[goalKey] === Infinity) return null;

  // reconstruct
  const path: Cell[] = [];
  let cur = goalKey;
  while (cur !== -1) {
    path.push([Math.floor(cur / cols), cur % cols]);
    if (cur === startKey) break;
    cur = cameFrom[cur];
  }
  path.reverse();
  return path;
}
