'use client'
import type { Reservation } from '../lib/types'

export default function ReservationRow({
  reservation,
  tableName,
  onCancel,
}: {
  reservation: Reservation
  tableName: string
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`reservation-${reservation.id}`}>
      <span data-testid={`reservation-${reservation.id}-table`}>{tableName}</span>
      <span data-testid={`reservation-${reservation.id}-time`}>{reservation.time}</span>
      <span data-testid={`reservation-${reservation.id}-party`}>{reservation.party}</span>
      <span data-testid={`reservation-${reservation.id}-name`}>{reservation.name}</span>
      <button data-testid={`cancel-${reservation.id}`} onClick={() => onCancel(reservation.id)}>
        Cancel
      </button>
    </li>
  )
}
