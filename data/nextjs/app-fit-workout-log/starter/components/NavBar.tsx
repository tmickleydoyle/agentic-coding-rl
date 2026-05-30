'use client'
import { useWorkout } from './WorkoutProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'log', label: 'Log' },
  { route: 'workout-detail', label: 'Detail' },
  { route: 'exercises', label: 'Exercises' },
  { route: 'records', label: 'Records' },
]

export default function NavBar() {
  const { route, navigate } = useWorkout()
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
