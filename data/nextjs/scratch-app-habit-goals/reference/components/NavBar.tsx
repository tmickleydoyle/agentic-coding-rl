'use client'
import { useGoals } from './GoalProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'goals', label: 'Goals' },
  { route: 'goal-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'completed', label: 'Completed' },
]

export default function NavBar() {
  const { route, navigate } = useGoals()
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
