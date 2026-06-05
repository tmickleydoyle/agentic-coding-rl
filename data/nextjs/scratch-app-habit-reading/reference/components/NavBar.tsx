'use client'
import { useReading } from './ReadingProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'books', label: 'Books' },
  { route: 'log', label: 'Log' },
  { route: 'stats', label: 'Stats' },
]

export default function NavBar() {
  const { route, navigate } = useReading()
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
