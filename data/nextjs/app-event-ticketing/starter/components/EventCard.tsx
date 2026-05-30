'use client'
import type { EventItem } from '../lib/types'

export default function EventCard({
  event,
  onView,
}: {
  event: EventItem
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`event-${event.id}`}>
      <span data-testid={`event-${event.id}-name`}>{event.name}</span>
      <span data-testid={`event-${event.id}-date`}>{event.date}</span>
      <span data-testid={`event-${event.id}-venue`}>{event.venue}</span>
      <button data-testid={`view-${event.id}`} onClick={() => onView(event.id)}>
        View
      </button>
    </li>
  )
}
