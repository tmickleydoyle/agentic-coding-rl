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
  // TODO: render <li data-testid="property-<id>" data-favorite> with address, type,
  // price, beds, an open-<id> button and a favorite-<id> button.
  void isFavorite
  void onToggleFavorite
  void onOpen
  return <li data-testid={`property-${property.id}`} />
}
