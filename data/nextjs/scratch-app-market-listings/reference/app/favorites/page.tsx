'use client'
import { useApp } from '../../components/AppStateProvider'

export default function FavoritesPage() {
  const { listings, favorites, select } = useApp()
  const favListings = listings.filter((l) => favorites.includes(l.id))

  return (
    <section data-testid="page-favorites">
      <h1>Favorites</h1>
      {favListings.length === 0 ? (
        <p data-testid="no-favorites">You have no favorites yet.</p>
      ) : (
        <ul data-testid="favorites-list">
          {favListings.map((l) => (
            <li key={l.id} data-testid={`fav-item-${l.id}`}>
              <span data-testid={`fav-item-${l.id}-title`}>{l.title}</span>
              <button data-testid={`view-${l.id}`} onClick={() => select(l.id)}>
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
