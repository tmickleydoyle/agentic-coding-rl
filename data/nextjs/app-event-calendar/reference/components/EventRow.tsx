'use client'
import type { EventItem } from '../lib/types'

export default function EventRow({ event }: { event: EventItem }) {
  return (
    <li data-testid={`event-${event.id}`}>
      <span data-testid={`event-${event.id}-title`}>{event.title}</span>
      <span data-testid={`event-${event.id}-category`}>{event.category}</span>
    </li>
  )
}
