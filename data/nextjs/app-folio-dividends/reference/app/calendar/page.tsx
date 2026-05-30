'use client'
import { useDividends } from '../../components/DividendsProvider'
import { calendarOf } from '../../hooks/useDividends'

export default function CalendarPage() {
  const { holdings } = useDividends()
  const months = calendarOf(holdings)
  return (
    <section data-testid="page-calendar">
      <h1>Dividend Calendar</h1>
      {months.length === 0 ? (
        <p data-testid="empty-calendar">No dividends scheduled.</p>
      ) : (
        <ul data-testid="calendar-list">
          {months.map((m) => (
            <li key={m.month} data-testid={`month-${m.month}`}>
              <span data-testid={`month-${m.month}-name`}>{m.name}</span>
              <span data-testid={`month-${m.month}-income`}>{m.income}</span>
              <span data-testid={`month-${m.month}-count`}>{m.holdings.length}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
