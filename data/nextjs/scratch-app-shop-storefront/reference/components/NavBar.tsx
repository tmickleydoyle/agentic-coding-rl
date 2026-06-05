'use client'
import { useShop } from './AppStateProvider'
import { useCart } from '../hooks/useCart'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'catalog', label: 'Catalog' },
  { route: 'product', label: 'Product' },
  { route: 'cart', label: 'Cart' },
  { route: 'checkout', label: 'Checkout' },
]

export default function NavBar() {
  const { route, navigate } = useShop()
  const { count } = useCart()
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
          {r.route === 'cart' ? <span data-testid="cart-badge">{count}</span> : null}
        </button>
      ))}
    </nav>
  )
}
