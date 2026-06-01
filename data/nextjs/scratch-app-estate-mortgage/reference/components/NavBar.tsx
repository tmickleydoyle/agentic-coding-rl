'use client'
import { useMortgage } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'properties', label: 'Properties' },
  { route: 'calculator', label: 'Calculator' },
  { route: 'compare', label: 'Compare' },
  { route: 'saved', label: 'Saved' },
]

export default function NavBar() {
  const { route, navigate } = useMortgage()
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
