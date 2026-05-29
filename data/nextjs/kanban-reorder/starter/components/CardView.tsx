'use client'
import type { Card } from './types'

// TODO: render <div data-testid={`card-${card.id}`}> with the title and four buttons
// data-testid up-/down-/left-/right-${id} wired to the handlers.
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
  return <div data-testid={`card-${card.id}`}>{card.title}</div>
}
