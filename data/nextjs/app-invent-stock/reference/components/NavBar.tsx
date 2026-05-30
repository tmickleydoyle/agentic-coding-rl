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
  const { route, navigate } = useStock()
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
