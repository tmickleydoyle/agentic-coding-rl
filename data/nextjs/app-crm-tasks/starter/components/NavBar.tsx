'use client'
import { useApp } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'today', label: 'Today' },
  { route: 'tasks', label: 'Tasks' },
  { route: 'contacts', label: 'Contacts' },
  { route: 'done', label: 'Done' },
]

export default function NavBar() {
  const { route, navigate } = useApp()
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
