'use client'
import { useShop } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'orders', label: 'Orders' },
  { route: 'order-detail', label: 'Detail' },
  { route: 'track', label: 'Track' },
  { route: 'account', label: 'Account' },
]

export default function NavBar() {
  const { navigate } = useShop()
  // TODO: mark the active route with aria-current="page".
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
