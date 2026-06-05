'use client'
import { useApp } from '../../components/AppStateProvider'
import { useSnippets } from '../../hooks/useSnippets'

export default function FavoritesPage() {
  const { toggleFavorite } = useApp()
  const { favorites } = useSnippets()

  return (
    <section data-testid="page-favorites">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p data-testid="favorites-empty">No favorites yet.</p>
      ) : (
        <ul data-testid="favorites-list">
          {favorites.map((s) => (
            <li key={s.id} data-testid={`favorite-${s.id}`}>
              <span data-testid={`favorite-${s.id}-title`}>{s.title}</span>
              <button data-testid={`unfav-${s.id}`} onClick={() => toggleFavorite(s.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
