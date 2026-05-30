'use client'
import { useApp } from '../../components/AppStateProvider'
import { dueCards } from '../../hooks/useSrs'
import DeckCard from '../../components/DeckCard'

export default function DecksPage() {
  const { decks, openDeck } = useApp()
  return (
    <section data-testid="page-decks">
      <h1>Decks</h1>
      <ul data-testid="deck-list">
        {decks.map((d) => (
          <DeckCard key={d.id} deck={d} dueCount={dueCards(d).length} onReview={openDeck} />
        ))}
      </ul>
    </section>
  )
}
