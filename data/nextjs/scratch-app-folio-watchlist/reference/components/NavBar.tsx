'use client'
import { useWatchlist } from './WatchlistProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'watchlist', label: 'Watchlist' },
  { route: 'ticker-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'alerts', label: 'Alerts' },
]

export default function NavBar() {
  const { route, navigate } = useWatchlist()
  return (
    <nav data-testid="navbar">
      {ROUTES.map((r) => (
        <button
          key={r.route}
          data-testid={`nav-${r.route}`}
          aria-current={route === r.route ? 'page' : undefined}
          onClick={() => navigate(r.route)}
        >
          {r.label}
        </button>
      ))}
    </nav>
  )
}
