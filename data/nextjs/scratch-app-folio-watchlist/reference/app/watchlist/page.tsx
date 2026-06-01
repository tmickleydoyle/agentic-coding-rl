'use client'
import { useWatchlist } from '../../components/WatchlistProvider'
import { useWatchlistSummary } from '../../hooks/useWatchlist'
import StatCard from '../../components/StatCard'
import TickerCard from '../../components/TickerCard'

export default function WatchlistPage() {
  const { tickers, selectTicker, removeTicker, theme, setTheme } = useWatchlist()
  const { totals } = useWatchlistSummary()
  return (
    <section data-testid="page-watchlist">
      <h1>Watchlist</h1>
      <div data-testid="stats">
        <StatCard label="Tickers" value={totals.tickerCount} testid="count" />
        <StatCard label="Alerts" value={totals.alertCount} testid="alerts" />
      </div>
      <p data-testid="current-theme">{theme}</p>
      <button
        data-testid="theme-toggle"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
      {tickers.length === 0 ? (
        <p data-testid="empty-watchlist">No tickers yet.</p>
      ) : (
        <ul data-testid="ticker-list">
          {tickers.map((t) => (
            <TickerCard key={t.id} ticker={t} onSelect={selectTicker} onRemove={removeTicker} />
          ))}
        </ul>
      )}
    </section>
  )
}
