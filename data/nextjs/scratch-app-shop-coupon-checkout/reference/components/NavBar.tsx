'use client'
import { useShop } from './AppStateProvider'
import { useCheckout } from '../hooks/useCheckout'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'cart', label: 'Cart' },
  { route: 'coupons', label: 'Coupons' },
  { route: 'checkout', label: 'Checkout' },
  { route: 'confirmation', label: 'Confirmation' },
]

export default function NavBar() {
  const { route, navigate } = useShop()
  const { count } = useCheckout()
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
