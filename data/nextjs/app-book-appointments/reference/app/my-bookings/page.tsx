'use client'
import { useApp } from '../../components/AppStateProvider'
import BookingRow from '../../components/BookingRow'

export default function MyBookingsPage() {
  const { bookings, services, cancel } = useApp()

  const serviceName = (id: string): string =>
    services.find((s) => s.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-my-bookings">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p data-testid="empty-state">No bookings yet.</p>
      ) : (
        <ul data-testid="bookings-list">
          {bookings.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              serviceName={serviceName(b.serviceId)}
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
