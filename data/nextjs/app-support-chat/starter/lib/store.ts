import type { Session } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `sessions` and id counters; seed them; provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSessions(_filter?: { status?: string | null }): Session[] {
  // TODO: return sessions, applying the optional ?status= filter
  return []
}

export function createSession(_input: { visitor: string; topic?: string }): Session {
  // TODO: append a new waiting session with a fresh id and return it
  return { id: '', visitor: '', topic: '', status: 'waiting', agent: null, messages: [] }
}

export function findSession(_id: string): Session | undefined {
  // TODO: look up a session by id
  return undefined
}

export function assignSession(_id: string, _agent: string): Session | undefined {
  // TODO: set agent + active; return it or undefined if absent
  return undefined
}

export function closeSession(_id: string): Session | undefined {
  // TODO: set status closed; return it or undefined if absent
  return undefined
}

export function addMessage(
  _id: string,
  _input: { from: 'visitor' | 'agent'; text: string },
): Session | undefined {
  // TODO: append a message; return it or undefined if absent
  return undefined
}

export function deleteSession(_id: string): boolean {
  // TODO: remove the session; return whether it existed
  return false
}
