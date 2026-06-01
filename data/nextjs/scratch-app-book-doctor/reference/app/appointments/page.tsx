'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAppointments } from '../../hooks/useAppointments'
import AppointmentRow from '../../components/AppointmentRow'

export default function AppointmentsPage() {
  const { providers, cancel } = useApp()
  const { upcoming } = useAppointments()

  const providerName = (id: string): string =>
    providers.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-appointments">
      <h1>Appointments</h1>
      {upcoming.length === 0 ? (
        <p data-testid="empty-state">No upcoming appointments.</p>
      ) : (
        <ul data-testid="upcoming-list">
          {upcoming.map((a) => (
            <AppointmentRow
              key={a.id}
              appointment={a}
              providerName={providerName(a.providerId)}
              prefix="appt"
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
