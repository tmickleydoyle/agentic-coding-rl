'use client'
import { useHistory } from '../../hooks/useLibrary'

export default function HistoryPage() {
  const watched = useHistory()

  if (watched.length === 0) {
    return (
      <section data-testid="page-history">
        <p data-testid="empty-history">No watch history yet.</p>
      </section>
    )
  }

  const totalTime = watched.reduce((sum, v) => sum + v.duration, 0)

  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <span data-testid="watched-count-value">{watched.length}</span>
      <span data-testid="total-watch-time-value">{totalTime}</span>
      <ul data-testid="history-list">
        {watched.map((v) => (
          <li key={v.id} data-testid={`hist-${v.id}`}>
            <span data-testid={`hist-${v.id}-title`}>{v.title}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
