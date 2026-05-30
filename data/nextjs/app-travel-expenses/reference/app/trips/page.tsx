'use client'
import { useExpenses } from '../../components/ExpensesProvider'
import { tripTotal } from '../../hooks/useExpenseStats'

export default function TripsPage() {
  const { trips, expenses, selectTrip } = useExpenses()
  return (
    <section data-testid="page-trips">
      <h1>Trips</h1>
      {trips.length === 0 ? (
        <p data-testid="empty-state">No trips yet.</p>
      ) : (
        <ul data-testid="trip-list">
          {trips.map((t) => (
            <li key={t.id} data-testid={`trip-${t.id}`}>
              <span data-testid={`trip-${t.id}-name`}>{t.name}</span>
              <span data-testid={`trip-${t.id}-total`}>{tripTotal(expenses, t.id)}</span>
              <button data-testid={`open-${t.id}`} onClick={() => selectTrip(t.id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
