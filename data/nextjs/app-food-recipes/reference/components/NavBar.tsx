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
  const { route, navigate, recipes } = useRecipes()
  const favCount = recipes.filter((r) => r.favorite).length
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
      <span data-testid="fav-badge">{favCount}</span>
    </nav>
  )
}
