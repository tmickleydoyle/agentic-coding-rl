import type { DM, Person, Thread } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level people/threads/dms + id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listPeople(): Person[] {
  // TODO: return all people
  return []
}

export function listThreads(_filter?: { unread?: boolean }): Thread[] {
  // TODO: return threads, applying an optional unread filter
  return []
}

export function createThread(_input: { personId: string }): Thread {
  // TODO: append a new thread (unread false) with a fresh id and return it
  return { id: '', personId: '', unread: false }
}

export function findThread(_id: string): Thread | undefined {
  // TODO: look up a thread by id
  return undefined
}

export function setUnread(_id: string, _unread?: boolean): Thread | undefined {
  // TODO: set/toggle unread; undefined if absent
  return undefined
}

export function deleteThread(_id: string): boolean {
  // TODO: remove the thread; return whether it existed
  return false
}

export function listDMs(_threadId: string): DM[] {
  // TODO: return DMs for a thread
  return []
}
