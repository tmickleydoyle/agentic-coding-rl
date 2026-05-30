'use client'
import { useMatrix } from './MatrixProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'matrix', label: 'Matrix' },
  { route: 'add', label: 'Add' },
  { route: 'focus-list', label: 'Focus' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = useMatrix()
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
