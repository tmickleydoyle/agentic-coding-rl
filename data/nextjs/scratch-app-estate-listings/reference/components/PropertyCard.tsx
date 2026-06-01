'use client'
import type { Property } from '../lib/types'

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: {
  property: Property
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`property-${property.id}`} data-favorite={isFavorite ? 'true' : 'false'}>
      <span data-testid={`property-${property.id}-address`}>{property.address}</span>
      <span data-testid={`property-${property.id}-type`}>{property.type}</span>
      <span data-testid={`property-${property.id}-price`}>{property.price}</span>
      <span data-testid={`property-${property.id}-beds`}>{property.beds}</span>
      <button data-testid={`open-${property.id}`} onClick={() => onOpen(property.id)}>
        View
      </button>
      <button
        data-testid={`favorite-${property.id}`}
        onClick={() => onToggleFavorite(property.id)}
      >
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </li>
  )
}
