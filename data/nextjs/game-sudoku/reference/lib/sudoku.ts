export function findConflicts(board: number[][]): Array<[number, number]> {
  const conflicted: boolean[][] = board.map((row) => row.map(() => false));

  const markGroup = (cells: Array<[number, number]>): void => {
    const seen = new Map<number, Array<[number, number]>>();
    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i];
      const v = board[r][c];
      if (v === 0) continue;
      const list = seen.get(v);
      if (list === undefined) seen.set(v, [[r, c]]);
      else list.push([r, c]);
    }
    seen.forEach((list) => {
      if (list.length > 1) {
        for (let i = 0; i < list.length; i++) {
          conflicted[list[i][0]][list[i][1]] = true;
        }
      }
    });
  };

  for (let r = 0; r < 9; r++) {
    const row: Array<[number, number]> = [];
    for (let c = 0; c < 9; c++) row.push([r, c]);
    markGroup(row);
  }
  for (let c = 0; c < 9; c++) {
    const col: Array<[number, number]> = [];
    for (let r = 0; r < 9; r++) col.push([r, c]);
    markGroup(col);
  }
  for (let b = 0; b < 9; b++) {
    const box: Array<[number, number]> = [];
    const br = Math.floor(b / 3) * 3;
    const bc = (b % 3) * 3;
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) box.push([br + dr, bc + dc]);
    }
    markGroup(box);
  }

  const out: Array<[number, number]> = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (conflicted[r][c]) out.push([r, c]);
    }
  }
  return out;
}

export function isValid(board: number[][]): boolean {
  return findConflicts(board).length === 0;
}

function canPlace(board: number[][], r: number, c: number, v: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === v) return false;
    if (board[i][c] === v) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      if (board[br + dr][bc + dc] === v) return false;
    }
  }
  return true;
}

export function solve(board: number[][]): number[][] | null {
  if (!isValid(board)) return null;
  const work = board.map((row) => row.slice());

  const backtrack = (): boolean => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (work[r][c] === 0) {
          for (let v = 1; v <= 9; v++) {
            if (canPlace(work, r, c, v)) {
              work[r][c] = v;
              if (backtrack()) return true;
              work[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return backtrack() ? work : null;
}
