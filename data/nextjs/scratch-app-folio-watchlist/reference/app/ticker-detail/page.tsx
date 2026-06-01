'use client'
import { useWatchlist } from '../../components/WatchlistProvider'
import { alertHit, distanceToTarget } from '../../hooks/useWatchlist'

export default function TickerDetailPage() {
  const { tickers, selectedTickerId, removeTicker, navigate } = useWatchlist()

  const ticker = tickers.find((t) => t.id === selectedTickerId)

  if (!ticker) {
    return (
      <section data-testid="page-ticker-detail">
        <p data-testid="no-ticker-selected">No ticker selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-ticker-detail">
      <h1 data-testid="detail-symbol">{ticker.symbol}</h1>
      <p data-testid="detail-name">{ticker.name}</p>
      <p data-testid="detail-price">{ticker.price}</p>
      <p data-testid="detail-target">{ticker.targetPrice}</p>
      <p data-testid="detail-direction">{ticker.direction}</p>
      <p data-testid="detail-distance">{distanceToTarget(ticker)}</p>
      {alertHit(ticker) ? (
        <p data-testid="detail-alert-hit">Alert hit!</p>
      ) : (
        <p data-testid="detail-alert-pending">Not yet</p>
      )}
      <button
        data-testid="remove-ticker"
        onClick={() => {
          removeTicker(ticker.id)
          navigate('watchlist')
        }}
      >
        Remove
      </button>
    </section>
  )
}
