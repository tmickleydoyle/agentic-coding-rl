import { NOW, type Event, type Rsvp } from './types'

// In-memory server store for the API routes. SEPARATE from the client Context state.
// Tests call __reset() in beforeEach for isolation.

let events: Event[] = []
let nextId = 1

function seed(): void {
  events = [
    { id: 'e1', title: 'Park Cleanup', day: 120, rsvp: 'going', going: 8 },
    { id: 'e2', title: 'Book Club', day: 90, rsvp: null, going: 4 },
    { id: 'e3', title: 'Hack Night', day: 130, rsvp: 'maybe', going: 12 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listEvents(filter?: { when?: string | null }): Event[] {
  let out = events.slice()
  const when = filter?.when
  if (when === 'upcoming') out = out.filter((e) => e.day >= NOW)
  else if (when === 'past') out = out.filter((e) => e.day < NOW)
  return out
}

export function findEvent(id: string): Event | undefined {
  return events.find((e) => e.id === id)
}

export function createEvent(input: { title: string; day?: number }): Event {
  const event: Event = {
    id: `e${nextId++}`,
    title: input.title,
    day: typeof input.day === 'number' ? input.day : NOW,
    rsvp: null,
    going: 0,
  }
  events.push(event)
  return event
}

export function updateEvent(id: string, patch: { rsvp?: Rsvp }): Event | undefined {
  const event = events.find((e) => e.id === id)
  if (!event) return undefined
  if (patch.rsvp) event.rsvp = patch.rsvp
  return event
}

export function deleteEvent(id: string): boolean {
  const idx = events.findIndex((e) => e.id === id)
  if (idx === -1) return false
  events.splice(idx, 1)
  return true
}

export function statsSnapshot(): {
  total: number
  upcoming: number
  past: number
  rsvpCounts: Record<Rsvp, number>
} {
  const rsvpCounts: Record<Rsvp, number> = { going: 0, maybe: 0, no: 0 }
  let upcoming = 0
  let past = 0
  events.forEach((e) => {
    if (e.day >= NOW) upcoming += 1
    else past += 1
    if (e.rsvp) rsvpCounts[e.rsvp] += 1
  })
  return { total: events.length, upcoming, past, rsvpCounts }
}
