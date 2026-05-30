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
  // TODO: render deck-<id> row: name, due count, total, and a review-<id> button.
  void dueCount
  void onReview
  return <li data-testid={`deck-${deck.id}`} />
}
