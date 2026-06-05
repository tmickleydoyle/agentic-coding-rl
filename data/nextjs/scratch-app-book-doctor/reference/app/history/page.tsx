'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAppointments } from '../../hooks/useAppointments'
import AppointmentRow from '../../components/AppointmentRow'

export default function HistoryPage() {
  const { providers } = useApp()
  const { past } = useAppointments()

  const providerName = (id: string): string =>
    providers.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {past.length === 0 ? (
        <p data-testid="history-empty">No past appointments.</p>
      ) : (
        <ul data-testid="past-list">
          {past.map((a) => (
            <AppointmentRow
              key={a.id}
              appointment={a}
              providerName={providerName(a.providerId)}
              prefix="past"
            />
          ))}
        </ul>
      )}
    </section>
  )
}
