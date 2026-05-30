'use client'
import { useEvents } from '../components/AppStateProvider'
import { NOW, RSVPS, type Event, type Rsvp, type TimeFilter } from '../lib/types'

export function attendeeCount(event: Event): number {
  return event.going + (event.rsvp === 'going' ? 1 : 0)
}

export function isUpcoming(event: Event): boolean {
  return event.day >= NOW
}

export function filterByTime(events: Event[], timeFilter: TimeFilter): Event[] {
  return events.filter((e) => {
    if (timeFilter === 'upcoming') return isUpcoming(e)
    if (timeFilter === 'past') return !isUpcoming(e)
    return true
  })
}

export function myEvents(events: Event[]): Event[] {
  return events.filter((e) => e.rsvp !== null)
}

export function rsvpCounts(events: Event[]): Record<Rsvp, number> {
  const out: Record<Rsvp, number> = { going: 0, maybe: 0, no: 0 }
  events.forEach((e) => {
    if (e.rsvp) out[e.rsvp] += 1
  })
  void RSVPS
  return out
}

export function useEventStats() {
  const { events, timeFilter } = useEvents()
  const filtered = filterByTime(events, timeFilter)
  const mine = myEvents(events)
  const counts = rsvpCounts(events)
  return { filtered, mine, counts }
}
