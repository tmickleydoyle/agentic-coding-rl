'use client'
import { useMortgage } from '../../components/AppStateProvider'
import PropertyCard from '../../components/PropertyCard'

export default function PropertiesPage() {
  const { properties, isSaved, toggleSaved } = useMortgage()
  return (
    <section data-testid="page-properties">
      <h1>Properties</h1>
      <ul data-testid="property-list">
        {properties.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            isSaved={isSaved(p.id)}
            onToggleSaved={toggleSaved}
          />
        ))}
      </ul>
    </section>
  )
}
