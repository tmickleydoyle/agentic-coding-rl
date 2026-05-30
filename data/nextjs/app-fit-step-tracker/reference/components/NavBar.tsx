'use client'
import { useStep } from './StepProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'history', label: 'History' },
  { route: 'goals', label: 'Goals' },
  { route: 'stats', label: 'Stats' },
]

export default function NavBar() {
  const { route, navigate } = useStep()
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
