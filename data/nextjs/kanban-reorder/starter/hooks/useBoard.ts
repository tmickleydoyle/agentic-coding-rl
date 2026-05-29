import { useState } from 'react'
import type { Board } from '../components/types'

// TODO: return { board, moveUp, moveDown, moveLeft, moveRight, counts }. moveUp/moveDown reorder
// within the column by -1/+1 (no-op at the ends). moveLeft/moveRight move to the adjacent column
// (by position in board.columns), appended to its end (no-op past first/last). counts = cards per
// column id.
export function useBoard(initial: Board) {
  const [board, setBoard] = useState<Board>(initial)
  return {
    board,
    moveUp: (_cardId: string) => {},
    moveDown: (_cardId: string) => {},
    moveLeft: (_cardId: string) => {},
    moveRight: (_cardId: string) => {},
    counts: {} as Record<string, number>,
  }
}
