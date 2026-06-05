'use client'
import { useEstate } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'listings', label: 'Listings' },
  { route: 'favorites', label: 'Favorites' },
  { route: 'filters', label: 'Filters' },
]

export default function NavBar() {
  const { route, navigate } = useEstate()
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
