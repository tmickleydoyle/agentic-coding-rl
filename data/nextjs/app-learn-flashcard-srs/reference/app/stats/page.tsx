'use client'
import { useApp } from '../../components/AppStateProvider'
import { dueCards } from '../../hooks/useSrs'

export default function StatsPage() {
  const { decks } = useApp()

  let totalCards = 0
  let dueToday = 0
  decks.forEach((d) => {
    totalCards += d.cards.length
    dueToday += dueCards(d).length
  })

  return (
    <section data-testid="page-stats">
      <h1>Stats</h1>
      <span data-testid="total-cards-value">{totalCards}</span>
      <span data-testid="due-today-value">{dueToday}</span>
      <ul data-testid="stat-deck-list">
        {decks.map((d) => (
          <li key={d.id} data-testid={`stat-deck-${d.id}`}>
            <span data-testid={`stat-deck-${d.id}-name`}>{d.name}</span>
            <span data-testid={`stat-deck-${d.id}-due`}>{dueCards(d).length}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
