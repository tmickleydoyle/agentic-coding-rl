export type Cell =
  | { state: 'hidden' }
  | { state: 'revealed'; adjacent: number }
  | { state: 'mine' };

export interface Board {
  mines: boolean[][];
  cells: Cell[][];
}

export function countAdjacent(mines: boolean[][], r: number, c: number): number {
  const rows = mines.length;
  const cols = rows > 0 ? mines[0].length : 0;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mines[nr][nc]) {
        count++;
      }
    }
  }
  return count;
}

function cloneCells(cells: Cell[][]): Cell[][] {
  return cells.map((row) => row.map((cell) => ({ ...cell })));
}

export function reveal(board: Board, r: number, c: number): Board {
  const rows = board.mines.length;
  const cols = rows > 0 ? board.mines[0].length : 0;
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    throw new Error('out of bounds');
  }
  if (board.cells[r][c].state !== 'hidden') {
    throw new Error('cell is not hidden');
  }

  const cells = cloneCells(board.cells);

  if (board.mines[r][c]) {
    cells[r][c] = { state: 'mine' };
    return { mines: board.mines, cells };
  }

  // BFS/DFS flood fill from (r, c)
  const stack: Array<[number, number]> = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop() as [number, number];
    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
    if (board.mines[cr][cc]) continue;
    if (cells[cr][cc].state === 'revealed') continue;
    const adjacent = countAdjacent(board.mines, cr, cc);
    cells[cr][cc] = { state: 'revealed', adjacent };
    if (adjacent === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([cr + dr, cc + dc]);
        }
      }
    }
  }

  return { mines: board.mines, cells };
}
