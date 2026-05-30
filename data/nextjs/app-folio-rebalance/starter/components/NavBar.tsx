'use client'
import { useRebalance } from './RebalanceProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'portfolio', label: 'Portfolio' },
  { route: 'targets', label: 'Targets' },
  { route: 'rebalance', label: 'Rebalance' },
  { route: 'history', label: 'History' },
]

export default function NavBar() {
  const { route, navigate } = useRebalance()
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
