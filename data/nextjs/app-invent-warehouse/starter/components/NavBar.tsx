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
  const { navigate } = useWarehouse()
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
