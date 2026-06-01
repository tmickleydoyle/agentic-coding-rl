'use client'
import { useApp } from '../../components/AppStateProvider'
import { deckProgress } from '../../hooks/useDeck'

export default function StatsPage() {
  const { decks, cards, resetDeck } = useApp()
  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <ul data-testid="stat-list">
        {decks.map((d) => {
          const p = deckProgress(cards, d.id)
          return (
            <li key={d.id} data-testid={`stat-${d.id}`}>
              <span data-testid={`stat-${d.id}-name`}>{d.name}</span>
              <span data-testid={`stat-${d.id}-known`}>{p.known}</span>
              <span data-testid={`stat-${d.id}-total`}>{p.total}</span>
              <button data-testid={`reset-${d.id}`} onClick={() => resetDeck(d.id)}>
                Reset
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
