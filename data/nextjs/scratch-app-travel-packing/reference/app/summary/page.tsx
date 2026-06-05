'use client'
import { usePacking } from '../../components/PackingProvider'
import { percentPacked } from '../../hooks/usePackingStats'
import StatCard from '../../components/StatCard'

export default function SummaryPage() {
  const { trips, items } = usePacking()
  const packed = items.filter((i) => i.packed).length
  return (
    <section data-testid="page-summary">
      <h1>Summary</h1>
      <div data-testid="stats">
        <StatCard label="Trips" value={trips.length} testid="trips" />
        <StatCard label="Items" value={items.length} testid="items" />
        <StatCard label="Packed" value={packed} testid="packed" />
      </div>
      <ul data-testid="trip-progress">
        {trips.map((t) => (
          <li key={t.id} data-testid={`progress-${t.id}`}>
            <span data-testid={`progress-${t.id}-name`}>{t.name}</span>
            <span data-testid={`progress-${t.id}-percent`}>{percentPacked(items, t.id)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
