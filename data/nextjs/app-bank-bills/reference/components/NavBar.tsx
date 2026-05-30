'use client'
import { useBills } from './BillsProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'bills', label: 'Bills' },
  { route: 'bill-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'upcoming', label: 'Upcoming' },
]

export default function NavBar() {
  const { route, navigate } = useBills()
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
