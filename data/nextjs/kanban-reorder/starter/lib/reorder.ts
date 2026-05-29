import type { Board } from '../components/types'

// TODO: locate a card by id, returning { columnId, index } or null.
export function findCard(
  board: Board,
  cardId: string
): { columnId: string; index: number } | null {
  return null
}

// TODO: return a NEW board with cardId placed at index `toIndex` of `toColumn`. Remove from its
// current column first; for a same-column move where the original index < toIndex, insert at
// toIndex-1 (the removal shifts later slots left); clamp into [0, targetLength-after-removal].
// Return the board unchanged if cardId or toColumn doesn't exist.
export function reorder(
  board: Board,
  cardId: string,
  toColumn: string,
  toIndex: number
): Board {
  return board
}
