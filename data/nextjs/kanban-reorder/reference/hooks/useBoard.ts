import { useState } from 'react'
import type { Board } from '../components/types'
import { findCard, reorder } from '../lib/reorder'

export function useBoard(initial: Board) {
  const [board, setBoard] = useState<Board>(initial)

  const moveUp = (cardId: string) => {
    setBoard((b) => {
      const loc = findCard(b, cardId)
      if (!loc || loc.index === 0) return b
      // final index loc.index-1; same column, from > toIndex -> insert at toIndex
      return reorder(b, cardId, loc.columnId, loc.index - 1)
    })
  }

  const moveDown = (cardId: string) => {
    setBoard((b) => {
      const loc = findCard(b, cardId)
      if (!loc) return b
      const len = (b.cards[loc.columnId] ?? []).length
      if (loc.index >= len - 1) return b
      // want final index loc.index+1; same column from < toIndex -> insert at toIndex-1,
      // so pass loc.index+2.
      return reorder(b, cardId, loc.columnId, loc.index + 2)
    })
  }

  const moveLeft = (cardId: string) => {
    setBoard((b) => {
      const loc = findCard(b, cardId)
      if (!loc) return b
      const colIdx = b.columns.findIndex((c) => c.id === loc.columnId)
      if (colIdx <= 0) return b
      const target = b.columns[colIdx - 1].id
      const end = (b.cards[target] ?? []).length
      return reorder(b, cardId, target, end)
    })
  }

  const moveRight = (cardId: string) => {
    setBoard((b) => {
      const loc = findCard(b, cardId)
      if (!loc) return b
      const colIdx = b.columns.findIndex((c) => c.id === loc.columnId)
      if (colIdx === -1 || colIdx >= b.columns.length - 1) return b
      const target = b.columns[colIdx + 1].id
      const end = (b.cards[target] ?? []).length
      return reorder(b, cardId, target, end)
    })
  }

  const counts: Record<string, number> = {}
  for (const col of board.columns) {
    counts[col.id] = (board.cards[col.id] ?? []).length
  }

  return { board, moveUp, moveDown, moveLeft, moveRight, counts }
}
