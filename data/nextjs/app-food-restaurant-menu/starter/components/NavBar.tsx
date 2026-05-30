'use client'
import { useMenu } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'menu', label: 'Menu' },
  { route: 'item-detail', label: 'Item' },
  { route: 'cart', label: 'Cart' },
  { route: 'checkout', label: 'Checkout' },
]

export default function NavBar() {
  const { navigate } = useMenu()
  // TODO: mark the active route with aria-current="page" and show a cart-badge count.
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
