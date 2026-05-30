'use client'
import { usePacking } from '../../components/PackingProvider'
import { percentPacked } from '../../hooks/usePackingStats'

export default function TripsPage() {
  const { trips, items, selectTrip } = usePacking()
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
              <span data-testid={`trip-${t.id}-percent`}>{percentPacked(items, t.id)}</span>
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
