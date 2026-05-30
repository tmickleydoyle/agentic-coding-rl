import type { Contact, FollowUp } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level contacts/followups + an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listContacts(): Contact[] {
  // TODO: return all contacts
  return []
}

export function listFollowUps(_filter?: { done?: boolean | null; contactId?: string | null }): FollowUp[] {
  // TODO: return follow-ups, applying optional done + contactId filters
  return []
}

export function findFollowUp(_id: string): FollowUp | undefined {
  // TODO: look up a follow-up by id
  return undefined
}

export function createFollowUp(_input: {
  title: string
  contactId?: string
  dueDate?: string
}): FollowUp {
  // TODO: append a new follow-up (done false) with a fresh id and defaults, return it
  return { id: '', title: '', contactId: 'c1', dueDate: '2026-06-01', done: false }
}

export function updateFollowUp(
  _id: string,
  _patch: { done?: boolean; dueDate?: string; title?: string },
): FollowUp | undefined {
  // TODO: apply the patch and return the updated follow-up, or undefined if absent
  return undefined
}

export function toggleFollowUp(_id: string): FollowUp | undefined {
  // TODO: flip done; return the follow-up or undefined if absent
  return undefined
}

export function deleteFollowUp(_id: string): boolean {
  // TODO: remove the follow-up; return whether it existed
  return false
}

export function countsByContact(): Array<Contact & { open: number; total: number }> {
  // TODO: per-contact open + total follow-up counts
  return []
}
