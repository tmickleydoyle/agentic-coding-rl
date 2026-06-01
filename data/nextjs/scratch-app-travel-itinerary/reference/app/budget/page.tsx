'use client'
import { useItinerary } from '../../components/ItineraryProvider'
import { tripTotal } from '../../hooks/useItineraryData'
import StatCard from '../../components/StatCard'

export default function BudgetPage() {
  const { trips, activities } = useItinerary()
  const grandTotal = activities.reduce((sum, a) => sum + a.cost, 0)
  return (
    <section data-testid="page-budget">
      <h1>Budget</h1>
      <div data-testid="stats">
        <StatCard label="Total trips" value={trips.length} testid="trips" />
        <StatCard label="Activities" value={activities.length} testid="activities" />
        <StatCard label="Grand total" value={grandTotal} testid="grand-total" />
      </div>
      <ul data-testid="trip-budgets">
        {trips.map((t) => (
          <li key={t.id} data-testid={`budget-${t.id}`}>
            <span data-testid={`budget-${t.id}-name`}>{t.name}</span>
            <span data-testid={`budget-${t.id}-cost`}>{tripTotal(activities, t.id)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
