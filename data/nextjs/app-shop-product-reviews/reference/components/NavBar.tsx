'use client'
import { useReviews } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'products', label: 'Products' },
  { route: 'product-reviews', label: 'Reviews' },
  { route: 'write-review', label: 'Write Review' },
  { route: 'top-rated', label: 'Top Rated' },
]

export default function NavBar() {
  const { route, navigate } = useReviews()
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
