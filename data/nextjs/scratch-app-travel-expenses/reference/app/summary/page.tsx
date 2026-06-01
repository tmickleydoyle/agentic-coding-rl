'use client'
import { useExpenses } from '../../components/ExpensesProvider'
import { byCategory, tripTotal } from '../../hooks/useExpenseStats'
import StatCard from '../../components/StatCard'

export default function SummaryPage() {
  const { trips, expenses, selectedTripId } = useExpenses()
  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0)
  const focusTripId = selectedTripId ?? trips[0]?.id ?? ''
  const categories = byCategory(expenses, focusTripId)
  return (
    <section data-testid="page-summary">
      <h1>Summary</h1>
      <div data-testid="stats">
        <StatCard label="Trips" value={trips.length} testid="trips" />
        <StatCard label="Expenses" value={expenses.length} testid="count" />
        <StatCard label="Grand total" value={grandTotal} testid="grand-total" />
      </div>
      <ul data-testid="trip-totals">
        {trips.map((t) => (
          <li key={t.id} data-testid={`total-${t.id}`}>
            <span data-testid={`total-${t.id}-name`}>{t.name}</span>
            <span data-testid={`total-${t.id}-amount`}>{tripTotal(expenses, t.id)}</span>
          </li>
        ))}
      </ul>
      <ul data-testid="category-totals">
        {categories.map((c) => (
          <li key={c.category} data-testid={`cat-${c.category}`}>
            <span data-testid={`cat-${c.category}-name`}>{c.category}</span>
            <span data-testid={`cat-${c.category}-amount`}>{c.total}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
