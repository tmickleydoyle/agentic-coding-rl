'use client'
import { useShopping } from '../../components/AppStateProvider'

export default function HistoryPage() {
  const { history } = useShopping()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      {history.length === 0 ? (
        <p data-testid="history-empty">No bought items yet.</p>
      ) : (
        <ul data-testid="history-list">
          {history.map((i) => (
            <li key={i.id} data-testid={`history-${i.id}`}>
              {i.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
