'use client'
import { useEstate } from '../../components/AppStateProvider'
import PropertyCard from '../../components/PropertyCard'

export default function FavoritesPage() {
  const { properties, favorites, isFavorite, toggleFavorite, openProperty } = useEstate()
  const favProperties = properties.filter((p) => favorites.indexOf(p.id) !== -1)

  return (
    <section data-testid="page-favorites">
      <h1>Favorites</h1>
      <p data-testid="favorites-count">{favProperties.length}</p>
      {favProperties.length === 0 ? (
        <p data-testid="favorites-empty">No favorites yet.</p>
      ) : (
        <ul data-testid="favorites-list">
          {favProperties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              isFavorite={isFavorite(p.id)}
              onToggleFavorite={toggleFavorite}
              onOpen={openProperty}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
