import type { Board, Outcome, Player } from './types'

// Pure tic-tac-toe logic. No React. Unit-tested directly.

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function emptyBoard(): Board {
  return [null, null, null, null, null, null, null, null, null]
}

export function winner(board: Board): 'X' | 'O' | null {
  for (let i = 0; i < LINES.length; i++) {
    const [a, b, c] = LINES[i]
    const v = board[a]
    if (v !== null && v === board[b] && v === board[c]) return v
  }
  return null
}

export function isFull(board: Board): boolean {
  return board.every((c) => c !== null)
}

export function outcome(board: Board): Outcome {
  const w = winner(board)
  if (w) return w
  if (isFull(board)) return 'draw'
  return null
}

export function applyMove(board: Board, index: number, mark: Player): Board {
  if (index < 0 || index > 8) return board
  if (board[index] !== null) return board
  const next = board.slice()
  next[index] = mark
  return next
}

function freeCells(board: Board): number[] {
  const out: number[] = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) out.push(i)
  }
  return out
}

function winningMove(board: Board, mark: Player): number {
  const free = freeCells(board)
  for (let i = 0; i < free.length; i++) {
    if (winner(applyMove(board, free[i], mark)) === mark) return free[i]
  }
  return -1
}

export function aiMove(board: Board): number {
  if (isFull(board)) return -1
  // 1. win
  const win = winningMove(board, 'O')
  if (win !== -1) return win
  // 2. block X
  const block = winningMove(board, 'X')
  if (block !== -1) return block
  // 3. center
  if (board[4] === null) return 4
  // 4. corners
  const corners = [0, 2, 6, 8]
  for (let i = 0; i < corners.length; i++) {
    if (board[corners[i]] === null) return corners[i]
  }
  // 5. first free
  const free = freeCells(board)
  return free.length > 0 ? free[0] : -1
}
