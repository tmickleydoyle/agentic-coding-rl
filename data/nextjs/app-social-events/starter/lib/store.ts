import type { Event, Rsvp } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `events` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEvents(_filter?: { when?: string | null }): Event[] {
  // TODO: return events, applying optional ?when=upcoming|past
  return []
}

export function findEvent(_id: string): Event | undefined {
  // TODO: look up an event by id
  return undefined
}

export function createEvent(_input: { title: string; day?: number }): Event {
  // TODO: append a new event (rsvp null, going 0) with a fresh id and return it
  return { id: '', title: '', day: 0, rsvp: null, going: 0 }
}

export function updateEvent(_id: string, _patch: { rsvp?: Rsvp }): Event | undefined {
  // TODO: set the rsvp and return the updated event, or undefined if absent
  return undefined
}

export function deleteEvent(_id: string): boolean {
  // TODO: remove the event; return whether it existed
  return false
}

export function statsSnapshot(): {
  total: number
  upcoming: number
  past: number
  rsvpCounts: Record<Rsvp, number>
} {
  // TODO: compute total, upcoming/past split and rsvp counts
  return { total: 0, upcoming: 0, past: 0, rsvpCounts: { going: 0, maybe: 0, no: 0 } }
}
