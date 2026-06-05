'use client'
import { useCards } from '../../components/CardsProvider'
import { useCardsSummary } from '../../hooks/useCards'
import StatCard from '../../components/StatCard'
import CardRow from '../../components/CardRow'

export default function CardsPage() {
  const { cards } = useCards()
  const { totals } = useCardsSummary()
  return (
    <section data-testid="page-cards">
      <h1>Cards</h1>
      <div data-testid="stats">
        <StatCard label="Limit" value={totals.totalLimit} testid="limit" />
        <StatCard label="Spent" value={totals.totalSpent} testid="spent" />
        <StatCard label="Frozen" value={totals.frozenCount} testid="frozen" />
        <StatCard label="Cards" value={totals.cardCount} testid="count" />
      </div>
      {cards.length === 0 ? (
        <p data-testid="empty-cards">No cards yet.</p>
      ) : (
        <ul data-testid="card-list">
          {cards.map((c) => (
            <CardRow key={c.id} card={c} />
          ))}
        </ul>
      )}
    </section>
  )
}
