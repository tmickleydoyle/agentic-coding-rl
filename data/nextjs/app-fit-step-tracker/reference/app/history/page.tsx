'use client'
import { useStep } from '../../components/StepProvider'
import { useStepStats } from '../../hooks/useStepStats'
import EntryRow from '../../components/EntryRow'

export default function HistoryPage() {
  const { goal, removeEntry } = useStep()
  const { sorted } = useStepStats()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {sorted.length === 0 ? (
        <p data-testid="empty-state">No entries yet.</p>
      ) : (
        <ul data-testid="entry-list">
          {sorted.map((e) => (
            <EntryRow key={e.id} entry={e} goal={goal} onRemove={removeEntry} />
          ))}
        </ul>
      )}
    </section>
  )
}
