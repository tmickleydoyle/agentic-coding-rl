'use client'
import type { Card as CardType, ColumnIndex } from './types'

export default function Card({
  card,
  column,
  onMove,
}: {
  card: CardType
  column: ColumnIndex
  onMove: (id: number, dir: -1 | 1) => void
}) {
  return (
    <div data-testid={`card-${card.id}`}>
      <span>{card.title}</span>
      <button
        data-testid={`back-${card.id}`}
        disabled={column === 0}
        onClick={() => onMove(card.id, -1)}
      >
        Back
      </button>
      <button
        data-testid={`forward-${card.id}`}
        disabled={column === 2}
        onClick={() => onMove(card.id, 1)}
      >
        Forward
      </button>
    </div>
  )
}
