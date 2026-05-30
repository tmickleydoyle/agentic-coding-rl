'use client'
import { useItinerary } from '../../components/ItineraryProvider'
import { tripTotal } from '../../hooks/useItineraryData'

export default function TripsPage() {
  const { trips, activities, selectTrip } = useItinerary()
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
              <span data-testid={`trip-${t.id}-destination`}>{t.destination}</span>
              <span data-testid={`trip-${t.id}-cost`}>{tripTotal(activities, t.id)}</span>
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
