'use client'
import { useWarehouse } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'bins', label: 'Bins' },
  { route: 'bin-detail', label: 'Detail' },
  { route: 'move', label: 'Move' },
  { route: 'map', label: 'Map' },
]

export default function NavBar() {
  const { route, navigate } = useWarehouse()
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
