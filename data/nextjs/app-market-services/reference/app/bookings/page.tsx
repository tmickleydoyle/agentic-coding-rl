'use client'
import { useApp } from '../../components/AppStateProvider'

export default function BookingsPage() {
  const { bookings, gigs } = useApp()

  const gigTitle = (id: string): string => gigs.find((g) => g.id === id)?.title ?? 'Unknown'

  return (
    <section data-testid="page-bookings">
      <h1>My bookings</h1>
      {bookings.length === 0 ? (
        <p data-testid="no-bookings">You have no bookings yet.</p>
      ) : (
        <ul data-testid="bookings-list">
          {bookings.map((b) => (
            <li key={b.id} data-testid={`booking-${b.id}`}>
              <span data-testid={`booking-${b.id}-gig`}>{gigTitle(b.gigId)}</span>
              <span data-testid={`booking-${b.id}-name`}>{b.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
