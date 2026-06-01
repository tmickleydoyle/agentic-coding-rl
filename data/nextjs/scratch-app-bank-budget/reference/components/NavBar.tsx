'use client'
import { useBudget } from './BudgetProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'overview', label: 'Overview' },
  { route: 'categories', label: 'Categories' },
  { route: 'transactions', label: 'Transactions' },
  { route: 'budgets', label: 'Budgets' },
]

export default function NavBar() {
  const { route, navigate } = useBudget()
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
