'use client'
import { useSubs } from './SubsProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'dashboard', label: 'Dashboard' },
  { route: 'subscriptions', label: 'Subscriptions' },
  { route: 'add', label: 'Add' },
  { route: 'upcoming', label: 'Upcoming' },
]

export default function NavBar() {
  const { route, navigate } = useSubs()
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
