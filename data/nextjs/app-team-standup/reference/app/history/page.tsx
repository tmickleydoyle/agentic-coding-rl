'use client'
import { useApp } from '../../components/AppStateProvider'
import { dates, entriesForDate } from '../../hooks/useStandup'
import EntryCard from '../../components/EntryCard'

export default function HistoryPage() {
  const { entries, members, selectedDate, selectDate } = useApp()
  const allDates = dates(entries)
  const memberName = (id: string): string => members.find((m) => m.id === id)?.name ?? 'Unknown'
  const dayEntries = entriesForDate(entries, selectedDate)

  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <select
        data-testid="date-select"
        value={selectedDate}
        onChange={(e) => selectDate(e.target.value)}
      >
        {allDates.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <span data-testid="history-count">{dayEntries.length}</span>
      {dayEntries.length === 0 ? (
        <p data-testid="history-empty">No standups on this date.</p>
      ) : (
        <ul data-testid="history-list">
          {dayEntries.map((e) => (
            <EntryCard key={e.id} entry={e} memberName={memberName(e.memberId)} />
          ))}
        </ul>
      )}
    </section>
  )
}
