'use client'
import { useWeight } from '../../components/WeightProvider'
import { useInsights } from '../../hooks/useInsights'
import EntryRow from '../../components/EntryRow'

export default function HistoryPage() {
  const { removeEntry } = useWeight()
  const { tagged } = useInsights()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {tagged.length === 0 ? (
        <p data-testid="empty-state">No entries yet.</p>
      ) : (
        <ul data-testid="entry-list">
          {tagged.map(({ entry, trend }) => (
            <EntryRow key={entry.id} entry={entry} trend={trend} onRemove={removeEntry} />
          ))}
        </ul>
      )}
    </section>
  )
}
