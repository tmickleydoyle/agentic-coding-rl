'use client'
import { useBoard } from './BoardProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'board', label: 'Board' },
  { route: 'add-card', label: 'Add card' },
  { route: 'archive', label: 'Archive' },
  { route: 'settings', label: 'Settings' },
]

export default function NavBar() {
  const { route, navigate } = useBoard()
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
