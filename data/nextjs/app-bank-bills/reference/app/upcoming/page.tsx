'use client'
import { useBills } from '../../components/BillsProvider'
import { overdueBills, upcomingBills } from '../../hooks/useBills'

export default function UpcomingPage() {
  const { bills, today } = useBills()
  const upcoming = upcomingBills(bills, today)
  const overdue = overdueBills(bills, today)

  return (
    <section data-testid="page-upcoming">
      <h1>Upcoming</h1>
      <h2>Upcoming</h2>
      {upcoming.length === 0 ? (
        <p data-testid="empty-upcoming">Nothing upcoming.</p>
      ) : (
        <ul data-testid="upcoming-list">
          {upcoming.map((b) => (
            <li key={b.id} data-testid={`upcoming-${b.id}`}>
              <span data-testid={`upcoming-${b.id}-name`}>{b.name}</span>
              <span data-testid={`upcoming-${b.id}-due`}>{b.dueDay}</span>
            </li>
          ))}
        </ul>
      )}

      <h2>Overdue</h2>
      {overdue.length === 0 ? (
        <p data-testid="empty-overdue">Nothing overdue.</p>
      ) : (
        <ul data-testid="overdue-list">
          {overdue.map((b) => (
            <li key={b.id} data-testid={`overdue-${b.id}`}>
              <span data-testid={`overdue-${b.id}-name`}>{b.name}</span>
              <span data-testid={`overdue-${b.id}-due`}>{b.dueDay}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
