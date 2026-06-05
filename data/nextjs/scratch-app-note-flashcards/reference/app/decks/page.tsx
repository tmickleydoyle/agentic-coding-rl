'use client'
import { useApp } from '../../components/AppStateProvider'

export default function DecksPage() {
  const { decks, cards, studyDeck, startAddCard } = useApp()
  const countFor = (id: string): number => cards.filter((c) => c.deckId === id).length
  return (
    <section data-testid="page-decks">
      <h1>Decks</h1>
      <ul data-testid="deck-list">
        {decks.map((d) => (
          <li key={d.id} data-testid={`deck-${d.id}`}>
            <span data-testid={`deck-${d.id}-name`}>{d.name}</span>
            <span data-testid={`deck-${d.id}-count`}>{countFor(d.id)}</span>
            <button data-testid={`study-${d.id}`} onClick={() => studyDeck(d.id)}>
              Study
            </button>
            <button data-testid={`add-${d.id}`} onClick={() => startAddCard(d.id)}>
              Add card
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
