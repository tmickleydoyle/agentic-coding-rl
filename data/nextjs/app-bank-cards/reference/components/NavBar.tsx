'use client'
import { useCards } from './CardsProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'cards', label: 'Cards' },
  { route: 'card-detail', label: 'Detail' },
  { route: 'transactions', label: 'Transactions' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = useCards()
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
