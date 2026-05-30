'use client'
import { useShopping } from './AppStateProvider'
import { useShoppingViews } from '../hooks/useShoppingViews'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'list', label: 'List' },
  { route: 'add', label: 'Add' },
  { route: 'aisles', label: 'Aisles' },
  { route: 'history', label: 'History' },
]

export default function NavBar() {
  const { route, navigate } = useShopping()
  const { remaining } = useShoppingViews()
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
      <span data-testid="remaining-badge">{remaining}</span>
    </nav>
  )
}
