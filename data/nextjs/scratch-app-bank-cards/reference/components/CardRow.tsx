'use client'
import { useCards } from './CardsProvider'
import { cardRemaining, cardSpend } from '../hooks/useCards'
import type { Card } from '../lib/types'

export default function CardRow({ card }: { card: Card }) {
  const { select, charges } = useCards()
  const spent = cardSpend(charges, card.id)
  const remaining = cardRemaining(card, charges)
  return (
    <li data-testid={`card-${card.id}`} data-frozen={card.frozen ? 'true' : 'false'}>
      <span data-testid={`card-${card.id}-label`}>{card.label}</span>
      <span data-testid={`card-${card.id}-last4`}>{card.last4}</span>
      <span data-testid={`card-${card.id}-spent`}>{spent}</span>
      <span data-testid={`card-${card.id}-remaining`}>{remaining}</span>
      <button data-testid={`card-${card.id}-open`} onClick={() => select(card.id)}>
        Open
      </button>
    </li>
  )
}
