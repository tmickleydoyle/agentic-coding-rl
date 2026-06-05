'use client'
import { useMenu } from './AppStateProvider'
import { useMenuViews } from '../hooks/useMenuViews'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'menu', label: 'Menu' },
  { route: 'item-detail', label: 'Item' },
  { route: 'cart', label: 'Cart' },
  { route: 'checkout', label: 'Checkout' },
]

export default function NavBar() {
  const { route, navigate } = useMenu()
  const { cartCount } = useMenuViews()
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
      <span data-testid="cart-badge">{cartCount}</span>
    </nav>
  )
}
