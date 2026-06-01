'use client'
import { useApp } from '../../components/AppStateProvider'
import { blockerCount, entriesForDate } from '../../hooks/useStandup'
import EntryCard from '../../components/EntryCard'
import { TODAY } from '../../lib/types'

export default function TodayPage() {
  const { entries, members } = useApp()
  const todays = entriesForDate(entries, TODAY)
  const memberName = (id: string): string => members.find((m) => m.id === id)?.name ?? 'Unknown'

  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <span data-testid="today-blocker-count">{blockerCount(todays)}</span>
      {todays.length === 0 ? (
        <p data-testid="today-empty">No standups yet today.</p>
      ) : (
        <ul data-testid="today-list">
          {todays.map((e) => (
            <EntryCard key={e.id} entry={e} memberName={memberName(e.memberId)} />
          ))}
        </ul>
      )}
    </section>
  )
}
