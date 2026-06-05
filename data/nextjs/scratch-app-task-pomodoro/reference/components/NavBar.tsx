'use client'
import { usePomodoro } from './PomodoroProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'tasks', label: 'Tasks' },
  { route: 'focus', label: 'Focus' },
  { route: 'stats', label: 'Stats' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = usePomodoro()
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
