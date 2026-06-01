'use client'
import { useWeight } from './WeightProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'log', label: 'Log' },
  { route: 'history', label: 'History' },
  { route: 'goal', label: 'Goal' },
  { route: 'insights', label: 'Insights' },
]

export default function NavBar() {
  const { route, navigate } = useWeight()
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
