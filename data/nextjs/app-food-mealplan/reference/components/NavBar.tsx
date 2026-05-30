'use client'
import { usePlan } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'week', label: 'Week' },
  { route: 'day-detail', label: 'Day' },
  { route: 'recipes', label: 'Recipes' },
  { route: 'grocery', label: 'Grocery' },
]

export default function NavBar() {
  const { route, navigate } = usePlan()
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
