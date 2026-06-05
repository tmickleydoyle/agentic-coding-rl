'use client'
import { useMood } from './MoodProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'history', label: 'History' },
  { route: 'add', label: 'Add' },
  { route: 'insights', label: 'Insights' },
]

export default function NavBar() {
  const { route, navigate } = useMood()
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
