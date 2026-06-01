'use client'
import { useEvents } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'events', label: 'Events' },
  { route: 'event-detail', label: 'Detail' },
  { route: 'create', label: 'Create' },
  { route: 'my-events', label: 'My Events' },
]

export default function NavBar() {
  const { route, navigate } = useEvents()
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
