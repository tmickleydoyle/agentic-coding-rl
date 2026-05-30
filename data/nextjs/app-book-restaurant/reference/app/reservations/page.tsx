'use client'
import { useApp } from '../../components/AppStateProvider'
import ReservationRow from '../../components/ReservationRow'

export default function ReservationsPage() {
  const { reservations, tables, cancel } = useApp()

  const tableName = (id: string): string =>
    tables.find((t) => t.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-reservations">
      <h1>Reservations</h1>
      {reservations.length === 0 ? (
        <p data-testid="empty-state">No reservations yet.</p>
      ) : (
        <ul data-testid="reservations-list">
          {reservations.map((r) => (
            <ReservationRow
              key={r.id}
              reservation={r}
              tableName={tableName(r.tableId)}
              onCancel={cancel}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
