'use client'
import type { Property } from '../lib/types'

export default function PropertyCard({
  property,
  isSaved,
  onToggleSaved,
  monthly,
}: {
  property: Property
  isSaved: boolean
  onToggleSaved: (id: string) => void
  monthly?: number
}) {
  return (
    <li data-testid={`property-${property.id}`} data-saved={isSaved ? 'true' : 'false'}>
      <span data-testid={`property-${property.id}-address`}>{property.address}</span>
      <span data-testid={`property-${property.id}-price`}>{property.price}</span>
      {monthly !== undefined ? (
        <span data-testid={`property-${property.id}-monthly`}>{monthly}</span>
      ) : null}
      <button data-testid={`save-${property.id}`} onClick={() => onToggleSaved(property.id)}>
        {isSaved ? 'Unsave' : 'Save'}
      </button>
    </li>
  )
}
