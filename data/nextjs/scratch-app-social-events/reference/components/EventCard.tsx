'use client'
import type { Event } from '../lib/types'
import { attendeeCount, isUpcoming } from '../hooks/useEventStats'

export default function EventCard({
  event,
  onView,
}: {
  event: Event
  onView: (id: string) => void
}) {
  return (
    <li data-testid={`event-${event.id}`} data-upcoming={isUpcoming(event) ? 'true' : 'false'}>
      <span data-testid={`event-${event.id}-title`}>{event.title}</span>
      <span data-testid={`event-${event.id}-count`}>{attendeeCount(event)}</span>
      <button data-testid={`view-${event.id}`} onClick={() => onView(event.id)}>
        View
      </button>
    </li>
  )
}
