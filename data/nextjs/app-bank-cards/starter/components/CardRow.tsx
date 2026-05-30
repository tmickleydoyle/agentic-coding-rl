'use client'
import { useCards } from './CardsProvider'
import { cardRemaining, cardSpend } from '../hooks/useCards'
import type { Card } from '../lib/types'

export default function CardRow({ card }: { card: Card }) {
  const { select, charges } = useCards()
  // TODO: render the card label/last4/spent/remaining and an open button calling select(id).
  void select
  void charges
  void cardRemaining
  void cardSpend
  return <li data-testid={`card-${card.id}`} data-frozen={card.frozen ? 'true' : 'false'} />
}
