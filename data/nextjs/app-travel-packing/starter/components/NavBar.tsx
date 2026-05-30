'use client'
import { usePacking } from './PackingProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'trips', label: 'Trips' },
  { route: 'list', label: 'List' },
  { route: 'add-item', label: 'Add Item' },
  { route: 'summary', label: 'Summary' },
]

export default function NavBar() {
  const { route, navigate } = usePacking()
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
