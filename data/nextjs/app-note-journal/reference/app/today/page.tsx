'use client'
import { useApp } from '../../components/AppStateProvider'
import { useJournal } from '../../hooks/useJournal'
import { TODAY } from '../../lib/types'

export default function TodayPage() {
  const { navigate } = useApp()
  const { todaysEntries } = useJournal()
  return (
    <section data-testid="page-today">
      <h1>Today</h1>
      <p data-testid="today-date">{TODAY}</p>
      <button data-testid="quick-new" onClick={() => navigate('new')}>
        New entry
      </button>
      {todaysEntries.length === 0 ? (
        <p data-testid="today-empty">No entries for today yet.</p>
      ) : (
        <ul data-testid="today-list">
          {todaysEntries.map((e) => (
            <li key={e.id} data-testid={`today-${e.id}`}>
              <span data-testid={`today-${e.id}-body`}>{e.body}</span>
              <span data-testid={`today-${e.id}-mood`}>{e.mood}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
