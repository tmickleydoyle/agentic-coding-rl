import type { Entry, Member } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level members/entries and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listMembers(): Member[] {
  // TODO: return all members
  return []
}

export function listEntries(_filter?: {
  date?: string | null
  memberId?: string | null
  blockers?: boolean
}): Entry[] {
  // TODO: return entries, applying optional date/memberId/blockers filters
  return []
}

export function createEntry(_input: {
  memberId: string
  date?: string
  yesterday: string
  today: string
  blocker?: string | null
}): Entry {
  // TODO: append a new entry with a fresh id; blank blocker => null; default date to TODAY
  return { id: '', memberId: '', date: '', yesterday: '', today: '', blocker: null }
}

export function deleteEntry(_id: string): boolean {
  // TODO: remove the entry; return whether it existed
  return false
}
