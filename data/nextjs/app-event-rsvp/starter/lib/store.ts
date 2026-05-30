import type { EventItem, Invite, Rsvp } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `events` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listEvents(_id?: string | null): EventItem[] {
  // TODO: return all events, or just the one matching ?id=
  return []
}

export function findEvent(_id: string): EventItem | undefined {
  // TODO: look up an event by id
  return undefined
}

export function isValidRsvp(_status: string): _status is Rsvp {
  // TODO: report whether status is one of yes/no/maybe/pending
  return false
}

export function createEvent(_input: { name: string; date: string }): EventItem {
  // TODO: append a new event with a fresh id and empty invites
  return { id: '', name: '', date: '', invites: [] }
}

export function updateInvite(
  _eventId: string,
  _inviteId: string,
  _status: Rsvp,
  _extraGuests: number,
): Invite | undefined {
  // TODO: update an invite's status + extraGuests; return it or undefined
  return undefined
}

export function deleteEvent(_id: string): boolean {
  // TODO: remove the event; return whether it existed
  return false
}
