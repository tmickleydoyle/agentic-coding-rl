'use client'
import { useSavings } from './SavingsProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'pots', label: 'Pots' },
  { route: 'pot-detail', label: 'Detail' },
  { route: 'create', label: 'Create' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = useSavings()
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
