'use client'
import { useShopping } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'list', label: 'List' },
  { route: 'add', label: 'Add' },
  { route: 'aisles', label: 'Aisles' },
  { route: 'history', label: 'History' },
]

export default function NavBar() {
  const { navigate } = useShopping()
  // TODO: mark the active route with aria-current="page" and show a remaining-badge count.
  return (
    <nav data-testid="navbar">
      {ROUTES.map((r) => (
        <button key={r.route} data-testid={`nav-${r.route}`} onClick={() => navigate(r.route)}>
          {r.label}
        </button>
      ))}
    </nav>
  )
}
