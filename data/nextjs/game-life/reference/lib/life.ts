function countNeighbors(grid: number[][], r: number, c: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        count++;
      }
    }
  }
  return count;
}

export function step(grid: number[][]): number[][] {
  if (grid.length === 0) return [];
  const rows = grid.length;
  const cols = grid[0].length;
  const next: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const alive = grid[r][c] === 1;
      const n = countNeighbors(grid, r, c);
      if (alive) {
        row.push(n === 2 || n === 3 ? 1 : 0);
      } else {
        row.push(n === 3 ? 1 : 0);
      }
    }
    next.push(row);
  }
  return next;
}

export function stepN(grid: number[][], n: number): number[][] {
  if (!Number.isInteger(n) || n < 0) throw new Error('n must be a non-negative integer');
  let current = grid.map((row) => row.slice());
  for (let i = 0; i < n; i++) {
    current = step(current);
  }
  return current;
}
