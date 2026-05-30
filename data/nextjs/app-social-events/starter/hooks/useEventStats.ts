'use client'
import { useEvents } from '../components/AppStateProvider'
import type { Event, Rsvp, TimeFilter } from '../lib/types'

export function attendeeCount(_event: Event): number {
  // TODO: base going + 1 if the user's own rsvp is 'going'
  return 0
}

export function isUpcoming(_event: Event): boolean {
  // TODO: day >= NOW
  return false
}

export function filterByTime(_events: Event[], _timeFilter: TimeFilter): Event[] {
  // TODO: apply the upcoming/past filter
  return []
}

export function myEvents(_events: Event[]): Event[] {
  // TODO: events with a non-null rsvp
  return []
}

export function rsvpCounts(_events: Event[]): Record<Rsvp, number> {
  // TODO: counts of the user's rsvp responses
  return { going: 0, maybe: 0, no: 0 }
}

export function useEventStats() {
  const { events, timeFilter } = useEvents()
  const filtered = filterByTime(events, timeFilter)
  const mine = myEvents(events)
  const counts = rsvpCounts(events)
  return { filtered, mine, counts }
}
