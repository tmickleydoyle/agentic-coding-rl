'use client'
import { useWatchlist } from '../../components/WatchlistProvider'
import { alertsOf, distanceToTarget } from '../../hooks/useWatchlist'

export default function AlertsPage() {
  const { tickers, selectTicker } = useWatchlist()
  const hits = alertsOf(tickers)
  return (
    <section data-testid="page-alerts">
      <h1>Alerts</h1>
      <p data-testid="alert-count">{hits.length}</p>
      {hits.length === 0 ? (
        <p data-testid="empty-alerts">No alerts hit.</p>
      ) : (
        <ul data-testid="alert-list">
          {hits.map((t) => (
            <li key={t.id} data-testid={`alert-${t.id}`}>
              <span data-testid={`alert-${t.id}-symbol`}>{t.symbol}</span>
              <span data-testid={`alert-${t.id}-price`}>{t.price}</span>
              <span data-testid={`alert-${t.id}-target`}>{t.targetPrice}</span>
              <span data-testid={`alert-${t.id}-distance`}>{distanceToTarget(t)}</span>
              <button data-testid={`alert-select-${t.id}`} onClick={() => selectTicker(t.id)}>
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
