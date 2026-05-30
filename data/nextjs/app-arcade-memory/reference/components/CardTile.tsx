'use client'
import type { Card } from '../lib/types'

export default function CardTile({
  card,
  onPick,
}: {
  card: Card
  onPick: (id: string) => void
}) {
  const shown = card.faceUp || card.matched
  return (
    <button
      data-testid={`card-${card.id}`}
      disabled={shown}
      onClick={() => onPick(card.id)}
    >
      {shown ? card.symbol : ''}
    </button>
  )
}
