'use client'
import { useRebalance } from '../../components/RebalanceProvider'

export default function HistoryPage() {
  const { history } = useRebalance()
  return (
    <section data-testid="page-history">
      <h1>History</h1>
      <p data-testid="history-count">{history.length}</p>
      {history.length === 0 ? (
        <p data-testid="empty-history">No rebalances logged.</p>
      ) : (
        <ul data-testid="history-list">
          {history.map((e) => (
            <li key={e.id} data-testid={`history-${e.id}`} data-action={e.action}>
              <span data-testid={`history-${e.id}-symbol`}>{e.symbol}</span>
              <span data-testid={`history-${e.id}-action`}>{e.action}</span>
              <span data-testid={`history-${e.id}-amount`}>{e.amount}</span>
              <span data-testid={`history-${e.id}-date`}>{e.date}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
