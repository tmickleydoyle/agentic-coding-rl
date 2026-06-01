'use client'
import { useMortgage } from '../../components/AppStateProvider'
import { useSaved } from '../../hooks/useSaved'
import PropertyCard from '../../components/PropertyCard'

export default function SavedPage() {
  const { isSaved, toggleSaved } = useMortgage()
  const { quotes } = useSaved()

  return (
    <section data-testid="page-saved">
      <h1>Saved</h1>
      <p data-testid="saved-count">{quotes.length}</p>
      {quotes.length === 0 ? (
        <p data-testid="saved-empty">No saved properties.</p>
      ) : (
        <ul data-testid="saved-list">
          {quotes.map((q) => (
            <PropertyCard
              key={q.property.id}
              property={q.property}
              isSaved={isSaved(q.property.id)}
              onToggleSaved={toggleSaved}
              monthly={q.monthly}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
