'use client'
import { useApp } from '../../components/AppStateProvider'
import { useWatchlist } from '../../hooks/useLibrary'

export default function WatchlistPage() {
  const { toggleWatchlist } = useApp()
  const items = useWatchlist()

  if (items.length === 0) {
    return (
      <section data-testid="page-watchlist">
        <p data-testid="empty-watchlist">Your watchlist is empty.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-watchlist">
      <h1>Watchlist</h1>
      <ul data-testid="watchlist-list">
        {items.map((v) => (
          <li key={v.id} data-testid={`wl-${v.id}`}>
            <span data-testid={`wl-${v.id}-title`}>{v.title}</span>
            <button data-testid={`wl-remove-${v.id}`} onClick={() => toggleWatchlist(v.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
