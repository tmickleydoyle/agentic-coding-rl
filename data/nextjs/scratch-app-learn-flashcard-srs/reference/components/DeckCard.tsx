'use client'
import type { Deck } from '../lib/types'

export default function DeckCard({
  deck,
  dueCount,
  onReview,
}: {
  deck: Deck
  dueCount: number
  onReview: (id: string) => void
}) {
  return (
    <li data-testid={`deck-${deck.id}`}>
      <span data-testid={`deck-${deck.id}-name`}>{deck.name}</span>
      <span data-testid={`deck-${deck.id}-due`}>{dueCount}</span>
      <span data-testid={`deck-${deck.id}-total`}>{deck.cards.length}</span>
      <button data-testid={`review-${deck.id}`} onClick={() => onReview(deck.id)}>
        Review
      </button>
    </li>
  )
}
