'use client'
import { useRecurring } from '../../components/RecurringProvider'

export default function HistoryPage() {
  const { history } = useRecurring()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <span data-testid="history-count">{history.length}</span>
      {history.length === 0 ? (
        <p data-testid="empty-history">No completions yet.</p>
      ) : (
        <ul data-testid="history-list">
          {history.map((h) => (
            <li key={h.id} data-testid={`history-${h.id}`}>
              <span data-testid={`history-${h.id}-title`}>{h.title}</span>
              <span data-testid={`history-${h.id}-date`}>{h.completedOn}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
