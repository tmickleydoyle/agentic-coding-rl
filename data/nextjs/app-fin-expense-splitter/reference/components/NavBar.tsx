'use client'
import { useSplit } from './SplitProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'expenses', label: 'Expenses' },
  { route: 'people', label: 'People' },
  { route: 'balances', label: 'Balances' },
]

export default function NavBar() {
  const { route, navigate } = useSplit()
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
