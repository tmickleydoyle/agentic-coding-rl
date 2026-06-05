'use client'
import { useExpenses } from './ExpensesProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'trips', label: 'Trips' },
  { route: 'expenses', label: 'Expenses' },
  { route: 'add', label: 'Add' },
  { route: 'summary', label: 'Summary' },
]

export default function NavBar() {
  const { route, navigate } = useExpenses()
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
