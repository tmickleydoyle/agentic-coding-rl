import type { Session } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `sessions` and an id counter; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSessions(_filter?: {
  track?: string | null
  slot?: string | null
}): Session[] {
  // TODO: return sessions, applying optional track + slot filters
  return []
}

export function isValidSlot(_slot: string): boolean {
  // TODO: report whether slot is one of SLOTS
  return false
}

export function createSession(_input: {
  title: string
  track: string
  slot: string
  speaker: string
}): Session {
  // TODO: append a new session with a fresh id and return it
  return { id: '', title: '', track: '', slot: '', speaker: '' }
}

export function deleteSession(_id: string): boolean {
  // TODO: remove the session; return whether it existed
  return false
}
