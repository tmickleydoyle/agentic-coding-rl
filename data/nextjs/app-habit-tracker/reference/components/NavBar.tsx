'use client'
import { useHabits } from './HabitProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'habits', label: 'Habits' },
  { route: 'add', label: 'Add' },
  { route: 'stats', label: 'Stats' },
]

export default function NavBar() {
  const { route, navigate } = useHabits()
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
