'use client'
import type { Appointment } from '../lib/types'

export default function AppointmentRow({
  appointment,
  providerName,
  prefix,
  onCancel,
}: {
  appointment: Appointment
  providerName: string
  prefix: string
  onCancel?: (id: string) => void
}) {
  return (
    <li data-testid={`${prefix}-${appointment.id}`}>
      <span data-testid={`${prefix}-${appointment.id}-provider`}>{providerName}</span>
      <span data-testid={`${prefix}-${appointment.id}-date`}>{appointment.date}</span>
      <span data-testid={`${prefix}-${appointment.id}-patient`}>{appointment.patient}</span>
      {onCancel ? (
        <button data-testid={`cancel-${appointment.id}`} onClick={() => onCancel(appointment.id)}>
          Cancel
        </button>
      ) : null}
    </li>
  )
}
