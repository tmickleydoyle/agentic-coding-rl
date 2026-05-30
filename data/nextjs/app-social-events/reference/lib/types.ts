export type Rsvp = 'going' | 'maybe' | 'no'

export type Event = {
  id: string
  title: string
  day: number
  rsvp: Rsvp | null
  going: number
}

export type TimeFilter = 'all' | 'upcoming' | 'past'

export type Route = 'events' | 'event-detail' | 'create' | 'my-events'
export type Theme = 'light' | 'dark'

export const NOW = 100
export const RSVPS: Rsvp[] = ['going', 'maybe', 'no']
