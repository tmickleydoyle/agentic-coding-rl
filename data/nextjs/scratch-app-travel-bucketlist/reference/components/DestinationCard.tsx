'use client'
import type { Destination } from '../lib/types'

export default function DestinationCard({
  destination,
  onOpen,
  onToggle,
}: {
  destination: Destination
  onOpen: (id: string) => void
  onToggle: (id: string) => void
}) {
  return (
    <li data-testid={`dest-${destination.id}`} data-visited={destination.visited ? 'true' : 'false'}>
      <span data-testid={`dest-${destination.id}-name`}>{destination.name}</span>
      <span data-testid={`dest-${destination.id}-country`}>{destination.country}</span>
      <span data-testid={`dest-${destination.id}-continent`}>{destination.continent}</span>
      <button data-testid={`toggle-${destination.id}`} onClick={() => onToggle(destination.id)}>
        {destination.visited ? 'Mark unvisited' : 'Mark visited'}
      </button>
      <button data-testid={`open-${destination.id}`} onClick={() => onOpen(destination.id)}>
        View
      </button>
    </li>
  )
}
