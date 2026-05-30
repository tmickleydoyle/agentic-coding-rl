'use client'
import type { Event } from '../lib/types'

export default function EventCard({
  event,
  onView,
}: {
  event: Event
  onView: (id: string) => void
}) {
  // TODO: render title, attendee count, a view-<id> button, and data-upcoming on the <li>
  void onView
  return <li data-testid={`event-${event.id}`} data-upcoming="false" />
}
