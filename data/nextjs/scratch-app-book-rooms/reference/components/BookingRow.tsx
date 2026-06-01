'use client'
import type { Booking } from '../lib/types'

export default function BookingRow({
  booking,
  roomName,
  onCancel,
}: {
  booking: Booking
  roomName: string
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`booking-${booking.id}`}>
      <span data-testid={`booking-${booking.id}-room`}>{roomName}</span>
      <span data-testid={`booking-${booking.id}-time`}>
        {booking.start}–{booking.end}
      </span>
      <span data-testid={`booking-${booking.id}-title`}>{booking.title}</span>
      <button data-testid={`cancel-${booking.id}`} onClick={() => onCancel(booking.id)}>
        Cancel
      </button>
    </li>
  )
}
