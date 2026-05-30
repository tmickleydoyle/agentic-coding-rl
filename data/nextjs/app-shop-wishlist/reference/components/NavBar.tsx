'use client'
import { useShop } from './AppStateProvider'
import { useWishlist } from '../hooks/useWishlist'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'browse', label: 'Browse' },
  { route: 'wishlist', label: 'Wishlist' },
  { route: 'cart', label: 'Cart' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = useShop()
  const { wishlistCount, cartCount } = useWishlist()
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
          {r.route === 'wishlist' ? <span data-testid="wishlist-badge">{wishlistCount}</span> : null}
          {r.route === 'cart' ? <span data-testid="cart-badge">{cartCount}</span> : null}
        </button>
      ))}
    </nav>
  )
}
