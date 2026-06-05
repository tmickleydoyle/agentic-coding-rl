'use client'
import { useRoutine } from './RoutineProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'routines', label: 'Routines' },
  { route: 'builder', label: 'Builder' },
  { route: 'week-plan', label: 'Week' },
  { route: 'library', label: 'Library' },
]

export default function NavBar() {
  const { route, navigate } = useRoutine()
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
