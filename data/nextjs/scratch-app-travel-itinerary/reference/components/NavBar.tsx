'use client'
import { useItinerary } from './ItineraryProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'trips', label: 'Trips' },
  { route: 'trip-detail', label: 'Detail' },
  { route: 'add-activity', label: 'Add Activity' },
  { route: 'budget', label: 'Budget' },
]

export default function NavBar() {
  const { route, navigate } = useItinerary()
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
