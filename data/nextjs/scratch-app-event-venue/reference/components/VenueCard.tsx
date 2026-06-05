'use client'
import type { Venue } from '../lib/types'

export default function VenueCard({
  venue,
  status,
  onView,
}: {
  venue: Venue
  status: string
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`venue-${venue.id}`}>
      <span data-testid={`venue-${venue.id}-name`}>{venue.name}</span>
      <span data-testid={`venue-${venue.id}-capacity`}>{venue.capacity}</span>
      <span data-testid={`venue-${venue.id}-status`}>{status}</span>
      <button data-testid={`view-${venue.id}`} onClick={() => onView(venue.id)}>
        View
      </button>
    </li>
  )
}
