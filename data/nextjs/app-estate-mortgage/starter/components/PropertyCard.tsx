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
  // TODO: render <li data-testid="property-<id>" data-saved> with address, price, an
  // optional property-<id>-monthly, and a save-<id> button.
  void isSaved
  void onToggleSaved
  void monthly
  return <li data-testid={`property-${property.id}`} />
}
