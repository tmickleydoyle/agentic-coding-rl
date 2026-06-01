'use client'
import { useRecurring } from './RecurringProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'all-tasks', label: 'All' },
  { route: 'add', label: 'Add' },
  { route: 'history', label: 'History' },
]

export default function NavBar() {
  const { route, navigate } = useRecurring()
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
