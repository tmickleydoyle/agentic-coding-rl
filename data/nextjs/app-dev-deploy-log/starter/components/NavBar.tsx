'use client'
import { useDeployments } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'deployments', label: 'Deployments' },
  { route: 'deploy-detail', label: 'Detail' },
  { route: 'environments', label: 'Environments' },
  { route: 'stats', label: 'Stats' },
]

export default function NavBar() {
  const { route, navigate } = useDeployments()
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
