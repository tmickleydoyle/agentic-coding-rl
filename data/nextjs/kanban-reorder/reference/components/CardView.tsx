'use client'
import type { Card } from './types'

export default function CardView({
  card,
  onUp,
  onDown,
  onLeft,
  onRight,
}: {
  card: Card
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
}) {
  return (
    <div data-testid={`card-${card.id}`}>
      <span>{card.title}</span>
      <button data-testid={`up-${card.id}`} onClick={onUp}>
        ↑
      </button>
      <button data-testid={`down-${card.id}`} onClick={onDown}>
        ↓
      </button>
      <button data-testid={`left-${card.id}`} onClick={onLeft}>
        ←
      </button>
      <button data-testid={`right-${card.id}`} onClick={onRight}>
        →
      </button>
    </div>
  )
}
