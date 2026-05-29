import type { Board, Card } from '../components/types'

export function findCard(
  board: Board,
  cardId: string
): { columnId: string; index: number } | null {
  for (const col of board.columns) {
    const list = board.cards[col.id] ?? []
    const index = list.findIndex((c) => c.id === cardId)
    if (index !== -1) return { columnId: col.id, index }
  }
  return null
}

export function reorder(
  board: Board,
  cardId: string,
  toColumn: string,
  toIndex: number
): Board {
  const loc = findCard(board, cardId)
  if (!loc) return board
  if (!board.columns.some((c) => c.id === toColumn)) return board

  const fromCol = loc.columnId
  const card = board.cards[fromCol][loc.index]

  // clone the affected columns
  const cards: Record<string, Card[]> = { ...board.cards }
  // remove from source
  const sourceList = [...(board.cards[fromCol] ?? [])]
  sourceList.splice(loc.index, 1)
  cards[fromCol] = sourceList

  // compute the target list AFTER removal
  const targetList =
    toColumn === fromCol ? sourceList : [...(cards[toColumn] ?? board.cards[toColumn] ?? [])]

  // same-column down-shift: removing an earlier item slides later slots left by one
  let insertAt = toIndex
  if (toColumn === fromCol && loc.index < toIndex) {
    insertAt = toIndex - 1
  }
  if (insertAt < 0) insertAt = 0
  if (insertAt > targetList.length) insertAt = targetList.length

  const nextTarget = [...targetList]
  nextTarget.splice(insertAt, 0, card)
  cards[toColumn] = nextTarget

  return { columns: board.columns, cards }
}
