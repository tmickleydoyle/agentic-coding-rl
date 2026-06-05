'use client'
import { useCards } from '../../components/CardsProvider'
import { cardRemaining, cardSpend, chargesFor } from '../../hooks/useCards'

export default function CardDetailPage() {
  const { cards, charges, selectedId, toggleFreeze } = useCards()
  const card = cards.find((c) => c.id === selectedId)

  if (!card) {
    return (
      <section data-testid="page-card-detail">
        <p data-testid="no-selection">No card selected.</p>
      </section>
    )
  }

  const spent = cardSpend(charges, card.id)
  const remaining = cardRemaining(card, charges)
  const cardCharges = chargesFor(charges, card.id)

  return (
    <section data-testid="page-card-detail">
      <h1 data-testid="card-label">{card.label}</h1>
      <p data-testid="card-limit">{card.limit}</p>
      <p data-testid="card-spent">{spent}</p>
      <p data-testid="card-remaining">{remaining}</p>
      <p data-testid="freeze-state">{card.frozen ? 'frozen' : 'active'}</p>
      <button data-testid="freeze-toggle" onClick={() => toggleFreeze(card.id)}>
        {card.frozen ? 'Unfreeze' : 'Freeze'}
      </button>
      {cardCharges.length === 0 ? (
        <p data-testid="no-charges">No charges.</p>
      ) : (
        <ul data-testid="charge-list">
          {cardCharges.map((h) => (
            <li key={h.id} data-testid={`charge-${h.id}`}>
              <span data-testid={`charge-${h.id}-merchant`}>{h.merchant}</span>
              <span data-testid={`charge-${h.id}-amount`}>{h.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
