export type Cell =
  | { state: 'hidden' }
  | { state: 'revealed'; adjacent: number }
  | { state: 'mine' };

export interface Board {
  mines: boolean[][];
  cells: Cell[][];
}

export function countAdjacent(mines: boolean[][], r: number, c: number): number {
  // TODO: implement
  void mines;
  void r;
  void c;
  throw new Error('not implemented');
}

export function reveal(board: Board, r: number, c: number): Board {
  // TODO: implement
  void board;
  void r;
  void c;
  throw new Error('not implemented');
}
