'use client'
import { useApp } from '../../components/AppStateProvider'
import BookingRow from '../../components/BookingRow'
import { useAvailability } from '../../hooks/useAvailability'

export default function BookingsPage() {
  const { bookings, venues, cancel } = useApp()
  const { totalAttendees } = useAvailability()

  const venueName = (id: string): string =>
    venues.find((v) => v.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-bookings">
      <h1>Bookings</h1>
      <span data-testid="total-attendees">{totalAttendees}</span>
      {bookings.length === 0 ? (
        <p data-testid="empty-state">No bookings yet.</p>
      ) : (
        <ul data-testid="bookings-list">
          {bookings.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              venueName={venueName(b.venueId)}
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
