'use client'
import { useShop } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'catalog', label: 'Catalog' },
  { route: 'product', label: 'Product' },
  { route: 'cart', label: 'Cart' },
  { route: 'checkout', label: 'Checkout' },
]

export default function NavBar() {
  const { navigate } = useShop()
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
