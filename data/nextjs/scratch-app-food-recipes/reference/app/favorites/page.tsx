'use client'
import { useRecipes } from '../../components/AppStateProvider'
import { useRecipeViews } from '../../hooks/useRecipeViews'

export default function FavoritesPage() {
  const { toggleFavorite } = useRecipes()
  const { favorites } = useRecipeViews()

  return (
    <section data-testid="page-favorites">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p data-testid="no-favorites">No favorites yet.</p>
      ) : (
        <ul data-testid="favorites-list">
          {favorites.map((r) => (
            <li key={r.id} data-testid={`fav-recipe-${r.id}`}>
              <span data-testid={`fav-recipe-${r.id}-title`}>{r.title}</span>
              <button
                data-testid={`unfav-${r.id}`}
                onClick={() => toggleFavorite(r.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
