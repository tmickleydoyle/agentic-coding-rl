'use client'
import { useSavings } from '../../components/SavingsProvider'
import { useSavingsSummary } from '../../hooks/useSavings'
import StatCard from '../../components/StatCard'
import PotRow from '../../components/PotRow'

export default function PotsPage() {
  const { pots, unallocated, currency } = useSavings()
  const { totals } = useSavingsSummary()
  return (
    <section data-testid="page-pots">
      <h1>Pots</h1>
      <p data-testid="currency-label">{currency}</p>
      <p data-testid="unallocated">{unallocated}</p>
      <div data-testid="stats">
        <StatCard label="Saved" value={totals.totalSaved} testid="saved" />
        <StatCard label="Goal" value={totals.totalGoal} testid="goal" />
        <StatCard label="Met" value={totals.metCount} testid="met" />
        <StatCard label="Pots" value={totals.potCount} testid="count" />
      </div>
      {pots.length === 0 ? (
        <p data-testid="empty-pots">No pots yet.</p>
      ) : (
        <ul data-testid="pot-list">
          {pots.map((p) => (
            <PotRow key={p.id} pot={p} />
          ))}
        </ul>
      )}
    </section>
  )
}
