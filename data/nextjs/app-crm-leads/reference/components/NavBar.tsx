'use client'
import { useApp } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'leads', label: 'Leads' },
  { route: 'lead-detail', label: 'Detail' },
  { route: 'qualify', label: 'Qualify' },
  { route: 'converted', label: 'Converted' },
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
