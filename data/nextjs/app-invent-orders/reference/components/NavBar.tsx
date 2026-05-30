'use client'
import { useOrdersState } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'orders', label: 'Orders' },
  { route: 'order-detail', label: 'Detail' },
  { route: 'new', label: 'New' },
  { route: 'suppliers', label: 'Suppliers' },
]

export default function NavBar() {
  const { route, navigate } = useOrdersState()
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
