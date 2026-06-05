'use client'
import { useApp } from '../../components/AppStateProvider'

export default function SchedulePage() {
  const { slots, bookings, services } = useApp()

  const serviceName = (id: string): string =>
    services.find((s) => s.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-schedule">
      <h1>Schedule</h1>
      <ul data-testid="schedule-list">
        {slots.map((slot) => {
          const inSlot = bookings.filter((b) => b.slot === slot)
          return (
            <li key={slot} data-testid={`slot-${slot}`}>
              <span data-testid={`slot-${slot}-count`}>{inSlot.length}</span>
              <ul>
                {inSlot.map((b) => (
                  <li key={b.id} data-testid={`booking-${b.id}`}>
                    <span>{serviceName(b.serviceId)}</span>
                    <span>{b.customer}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
