'use client'
import { useApp } from '../../components/AppStateProvider'
import { useListings } from '../../hooks/useListings'
import Filters from '../../components/Filters'
import ListingCard from '../../components/ListingCard'

export default function BrowsePage() {
  const { favorites, categoryFilter, setCategoryFilter, select, toggleFavorite } = useApp()
  const { filtered } = useListings()

  return (
    <section data-testid="page-browse">
      <h1>Browse</h1>
      <Filters categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter} />
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No listings match this filter.</p>
      ) : (
        <ul data-testid="listing-list">
          {filtered.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              favorited={favorites.includes(l.id)}
              onView={select}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
