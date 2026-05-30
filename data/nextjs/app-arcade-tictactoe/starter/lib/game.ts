import type { Board, Outcome, Player } from './types'

// Pure tic-tac-toe logic. No React. The stubs below compile but are wrong — implement them.

export function emptyBoard(): Board {
  // TODO: return nine nulls
  return []
}

export function winner(_board: Board): 'X' | 'O' | null {
  // TODO: return the mark filling any row/column/diagonal, else null
  return null
}

export function isFull(_board: Board): boolean {
  // TODO: true when no cell is null
  return false
}

export function outcome(_board: Board): Outcome {
  // TODO: winner, else 'draw' when full, else null
  return null
}

export function applyMove(board: Board, _index: number, _mark: Player): Board {
  // TODO: return a NEW board with mark placed; same reference if illegal
  return board
}

export function aiMove(_board: Board): number {
  // TODO: deterministic O move: win, block, center, corner, first free; -1 if full
  return -1
}
