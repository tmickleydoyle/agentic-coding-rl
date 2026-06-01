'use client'
import type { Booking } from '../lib/types'

export default function BookingRow({
  booking,
  serviceName,
  onCancel,
}: {
  booking: Booking
  serviceName: string
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`booking-${booking.id}`}>
      <span data-testid={`booking-${booking.id}-service`}>{serviceName}</span>
      <span data-testid={`booking-${booking.id}-slot`}>{booking.slot}</span>
      <span data-testid={`booking-${booking.id}-customer`}>{booking.customer}</span>
      <button data-testid={`cancel-${booking.id}`} onClick={() => onCancel(booking.id)}>
        Cancel
      </button>
    </li>
  )
}
