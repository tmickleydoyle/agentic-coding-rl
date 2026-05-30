'use client'
import type { Booking } from '../lib/types'

export default function BookingRow({
  booking,
  venueName,
  onCancel,
}: {
  booking: Booking
  venueName: string
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`booking-${booking.id}`}>
      <span data-testid={`booking-${booking.id}-venue`}>{venueName}</span>
      <span data-testid={`booking-${booking.id}-date`}>{booking.date}</span>
      <span data-testid={`booking-${booking.id}-attendees`}>{booking.attendees}</span>
      <span data-testid={`booking-${booking.id}-organizer`}>{booking.organizer}</span>
      <button data-testid={`cancel-${booking.id}`} onClick={() => onCancel(booking.id)}>
        Cancel
      </button>
    </li>
  )
}
