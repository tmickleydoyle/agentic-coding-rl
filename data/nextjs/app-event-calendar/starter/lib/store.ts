import type { EventItem } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `events` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEvents(_filter?: {
  category?: string | null
  day?: string | null
}): EventItem[] {
  // TODO: return events, applying optional category + day filters
  return []
}

export function isValidDay(_day: number): boolean {
  // TODO: report whether day is an integer in 1..DAYS_IN_MONTH
  return false
}

export function createEvent(_input: {
  title: string
  day: number
  category: string
}): EventItem {
  // TODO: append a new event with a fresh id and return it
  return { id: '', title: '', day: 0, category: '' }
}

export function deleteEvent(_id: string): boolean {
  // TODO: remove the event; return whether it existed
  return false
}
