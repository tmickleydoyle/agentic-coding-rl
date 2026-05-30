'use client'
import { useMood } from '../../components/MoodProvider'
import { useMoodInsights } from '../../hooks/useMoodInsights'
import MoodRow from '../../components/MoodRow'

export default function HistoryPage() {
  const { removeEntry } = useMood()
  const { sorted } = useMoodInsights()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {sorted.length === 0 ? (
        <p data-testid="empty-state">No entries yet.</p>
      ) : (
        <ul data-testid="entry-list">
          {sorted.map((e) => (
            <MoodRow key={e.id} entry={e} onRemove={removeEntry} />
          ))}
        </ul>
      )}
    </section>
  )
}
