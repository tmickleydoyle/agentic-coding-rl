'use client'
import { useRecipes } from './AppStateProvider'
import type { Route } from '../lib/types'

const ROUTES: { route: Route; label: string }[] = [
  { route: 'recipes', label: 'Recipes' },
  { route: 'recipe-detail', label: 'Detail' },
  { route: 'add', label: 'Add' },
  { route: 'favorites', label: 'Favorites' },
]

export default function NavBar() {
  const { navigate } = useRecipes()
  // TODO: mark the active route with aria-current="page" and show a fav-badge count.
  return (
    <nav data-testid="navbar">
      {ROUTES.map((r) => (
        <button key={r.route} data-testid={`nav-${r.route}`} onClick={() => navigate(r.route)}>
          {r.label}
        </button>
      ))}
    </nav>
  )
}
