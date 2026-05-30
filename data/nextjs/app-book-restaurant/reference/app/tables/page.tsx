'use client'
import { useApp } from '../../components/AppStateProvider'
import TableCard from '../../components/TableCard'

export default function TablesPage() {
  const { tables, reservations } = useApp()

  const countFor = (tableId: string): number =>
    reservations.filter((r) => r.tableId === tableId).length

  return (
    <section data-testid="page-tables">
      <h1>Tables</h1>
      <ul data-testid="tables-list">
        {tables.map((t) => (
          <TableCard key={t.id} table={t} reservationCount={countFor(t.id)} />
        ))}
      </ul>
    </section>
  )
}
