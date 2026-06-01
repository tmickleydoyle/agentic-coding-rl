'use client'
import { useEstate } from '../../components/AppStateProvider'

export default function PropertyDetailPage() {
  const { properties, selectedId, isFavorite, toggleFavorite, navigate } = useEstate()
  const property = properties.find((p) => p.id === selectedId)

  if (!property) {
    return (
      <section data-testid="page-property-detail">
        <p data-testid="detail-empty">No property selected.</p>
      </section>
    )
  }

  return (
    <section data-testid="page-property-detail">
      <h1 data-testid="detail-address">{property.address}</h1>
      <p data-testid="detail-type">{property.type}</p>
      <p data-testid="detail-price">{property.price}</p>
      <p data-testid="detail-beds">{property.beds}</p>
      <p data-testid="detail-baths">{property.baths}</p>
      <button
        data-testid="detail-favorite"
        onClick={() => toggleFavorite(property.id)}
      >
        {isFavorite(property.id) ? 'Unfavorite' : 'Favorite'}
      </button>
      <button data-testid="detail-back" onClick={() => navigate('listings')}>
        Back
      </button>
    </section>
  )
}
