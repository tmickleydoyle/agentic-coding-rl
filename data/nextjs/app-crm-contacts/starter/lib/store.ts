import type { Activity, ActivityKind, Company, Contact } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level companies/contacts/activities + id counters; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function isKind(_v: unknown): _v is ActivityKind {
  // TODO: narrow a value to a valid ActivityKind
  return false
}

export function listCompanies(): Company[] {
  // TODO: return all companies
  return []
}

export function listContacts(_filter?: { companyId?: string | null; tag?: string | null }): Contact[] {
  // TODO: return contacts, applying optional companyId + tag filters
  return []
}

export function findContact(_id: string): Contact | undefined {
  // TODO: look up a contact by id
  return undefined
}

export function createContact(_input: {
  name: string
  companyId?: string
  tags?: string[]
}): Contact {
  // TODO: append a new contact with a fresh id and defaults, return it
  return { id: '', name: '', companyId: '', tags: [] }
}

export function addTag(_id: string, _tag: string): Contact | undefined {
  // TODO: add a tag (no dups); return the contact or undefined if absent
  return undefined
}

export function removeTag(_id: string, _tag: string): Contact | undefined {
  // TODO: remove a tag; return the contact or undefined if absent
  return undefined
}

export function deleteContact(_id: string): boolean {
  // TODO: remove the contact and its activities; return whether it existed
  return false
}

export function listActivities(_contactId?: string | null): Activity[] {
  // TODO: return activities, optionally filtered by contactId
  return []
}

export function logActivity(_input: {
  contactId: string
  kind: ActivityKind
  text: string
}): Activity {
  // TODO: append a new activity with a fresh id and return it
  return { id: '', contactId: '', kind: 'note', text: '' }
}
