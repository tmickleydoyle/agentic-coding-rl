'use client'
import { useApp } from '../../components/AppStateProvider'
import BookingRow from '../../components/BookingRow'

export default function MyBookingsPage() {
  const { bookings, rooms, cancel } = useApp()

  const roomName = (id: string): string =>
    rooms.find((r) => r.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-my-bookings">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p data-testid="empty-state">No bookings yet.</p>
      ) : (
        <ul data-testid="bookings-list">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} roomName={roomName(b.roomId)} onCancel={cancel} />
          ))}
        </ul>
      )}
    </section>
  )
}
