'use client'
import { usePortfolio } from './PortfolioProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'portfolio', label: 'Portfolio' },
  { route: 'holding-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'allocation', label: 'Allocation' },
]

export default function NavBar() {
  const { route, navigate } = usePortfolio()
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
