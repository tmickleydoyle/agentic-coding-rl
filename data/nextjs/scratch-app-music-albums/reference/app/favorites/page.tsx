'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAlbums } from '../../hooks/useAlbums'

export default function FavoritesPage() {
  const { toggleFavorite } = useApp()
  const { favorites, averageRating } = useAlbums()

  return (
    <section data-testid="page-favorites">
      <h1>Favorites</h1>
      <p data-testid="avg-rating">{averageRating}</p>
      {favorites.length === 0 ? (
        <p data-testid="favorites-empty">No favorites yet.</p>
      ) : (
        <ul data-testid="favorites-list">
          {favorites.map((a) => (
            <li key={a.id} data-testid={`favorite-${a.id}`}>
              <span data-testid={`favorite-${a.id}-title`}>{a.title}</span>
              <button data-testid={`unfav-${a.id}`} onClick={() => toggleFavorite(a.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
