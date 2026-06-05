'use client'
import { useApp } from '../../components/AppStateProvider'
import { useStations } from '../../hooks/useStations'

export default function HistoryPage() {
  const { clearHistory } = useApp()
  const { historyStations, totalPlays } = useStations()

  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <p data-testid="total-plays">{totalPlays}</p>
      <button data-testid="clear-history" onClick={() => clearHistory()}>
        Clear history
      </button>
      {historyStations.length === 0 ? (
        <p data-testid="history-empty">No history yet.</p>
      ) : (
        <ol data-testid="history-list">
          {historyStations.map((s) => (
            <li key={s.id} data-testid={`hist-${s.id}`}>
              <span data-testid={`hist-${s.id}-name`}>{s.name}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
