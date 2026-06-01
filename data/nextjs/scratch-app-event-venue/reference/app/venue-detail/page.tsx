'use client'
import { useApp } from '../../components/AppStateProvider'

export default function VenueDetailPage() {
  const { venues, selectedVenueId, bookingsFor, navigate } = useApp()
  const venue = venues.find((v) => v.id === selectedVenueId)

  if (!venue) {
    return (
      <section data-testid="page-venue-detail">
        <h1>Venue</h1>
        <p data-testid="no-venue">No venue selected.</p>
      </section>
    )
  }

  const vbookings = bookingsFor(venue.id)

  return (
    <section data-testid="page-venue-detail">
      <h1 data-testid="venue-name">{venue.name}</h1>
      <span data-testid="venue-capacity">{venue.capacity}</span>
      <button data-testid="book-btn" onClick={() => navigate('book')}>
        Book this venue
      </button>
      {vbookings.length === 0 ? (
        <p data-testid="no-bookings">No bookings yet.</p>
      ) : (
        <ul data-testid="venue-bookings">
          {vbookings.map((b) => (
            <li key={b.id} data-testid={`vb-${b.id}`}>
              <span data-testid={`vb-${b.id}-date`}>{b.date}</span>
              <span data-testid={`vb-${b.id}-attendees`}>{b.attendees}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
