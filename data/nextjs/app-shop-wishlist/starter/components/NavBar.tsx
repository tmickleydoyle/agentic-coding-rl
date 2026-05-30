'use client'
import { useShop } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'browse', label: 'Browse' },
  { route: 'wishlist', label: 'Wishlist' },
  { route: 'cart', label: 'Cart' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { navigate } = useShop()
  // TODO: mark the active route with aria-current="page" and show wishlist + cart badges.
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
