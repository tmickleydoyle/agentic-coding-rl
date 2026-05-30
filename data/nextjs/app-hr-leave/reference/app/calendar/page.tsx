'use client'
import { useApp } from '../../components/AppStateProvider'
import { sortedByDay } from '../../hooks/useLeave'

export default function CalendarPage() {
  const { employees, requests } = useApp()
  const empName = (id: string): string => employees.find((e) => e.id === id)?.name ?? 'Unknown'
  const approved = sortedByDay(requests.filter((r) => r.status === 'approved'))
  return (
    <section data-testid="page-calendar">
      <h1>Calendar</h1>
      <span data-testid="calendar-count">{approved.length}</span>
      <ul data-testid="calendar-list">
        {approved.map((r) => (
          <li key={r.id} data-testid={`calendar-entry-${r.id}`}>
            <span data-testid={`calendar-entry-${r.id}-day`}>{r.day}</span>
            <span data-testid={`calendar-entry-${r.id}-employee`}>{empName(r.employeeId)}</span>
            <span data-testid={`calendar-entry-${r.id}-days`}>{r.days}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
