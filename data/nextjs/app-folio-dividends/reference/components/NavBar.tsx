'use client'
import { useDividends } from './DividendsProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'holding-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'calendar', label: 'Calendar' },
]

export default function NavBar() {
  const { route, navigate } = useDividends()
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
