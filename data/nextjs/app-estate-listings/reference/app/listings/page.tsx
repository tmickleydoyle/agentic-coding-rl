'use client'
import { useEstate } from '../../components/AppStateProvider'
import { useListings } from '../../hooks/useListings'
import PropertyCard from '../../components/PropertyCard'

export default function ListingsPage() {
  const { isFavorite, toggleFavorite, openProperty } = useEstate()
  const { filtered, stats } = useListings()

  return (
    <section data-testid="page-listings">
      <h1>Listings</h1>
      <p data-testid="listing-count">{filtered.length}</p>
      <p data-testid="average-price">{stats.averagePrice}</p>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No properties match these filters.</p>
      ) : (
        <ul data-testid="property-list">
          {filtered.map((p) => (
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
