'use client'
import { useStock } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'products', label: 'Products' },
  { route: 'product-detail', label: 'Detail' },
  { route: 'adjust', label: 'Adjust' },
  { route: 'low-stock', label: 'Low Stock' },
]

export default function NavBar() {
  const { navigate } = useStock()
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
