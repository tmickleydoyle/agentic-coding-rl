'use client'
import { useApp } from '../../components/AppStateProvider'
import { entriesForDay, weekTotal } from '../../hooks/useTimesheet'
import EntryRow from '../../components/EntryRow'
import { DAYS } from '../../lib/types'

export default function WeekPage() {
  const { entries, projects } = useApp()
  const projectName = (id: string): string => projects.find((p) => p.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-week">
      <h1>Week</h1>
      <span data-testid="week-total">{weekTotal(entries)}</span>
      {DAYS.map((day) => {
        const dayEntries = entriesForDay(entries, day)
        const total = dayEntries.reduce((acc, e) => acc + e.hours, 0)
        return (
          <div key={day} data-testid={`day-${day}`}>
            <span data-testid={`day-${day}-label`}>{day}</span>
            <span data-testid={`day-${day}-total`}>{total}</span>
            <ul data-testid={`day-${day}-list`}>
              {dayEntries.map((e) => (
                <EntryRow key={e.id} entry={e} projectName={projectName(e.projectId)} />
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
