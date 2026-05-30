import type { Activity, ActivityKind, Company, Contact } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let companies: Company[] = []
let contacts: Contact[] = []
let activities: Activity[] = []
let nextContactId = 1
let nextActivityId = 1

const KINDS: ActivityKind[] = ['call', 'email', 'note']

function seed(): void {
  companies = [
    { id: 'co1', name: 'Acme' },
    { id: 'co2', name: 'Globex' },
  ]
  contacts = [
    { id: 'c1', name: 'Ada Byron', companyId: 'co1', tags: ['vip', 'lead'] },
    { id: 'c2', name: 'Grace Hopper', companyId: 'co1', tags: ['lead'] },
    { id: 'c3', name: 'Linus T', companyId: 'co2', tags: [] },
  ]
  activities = [
    { id: 'a1', contactId: 'c1', kind: 'call', text: 'Intro call' },
    { id: 'a2', contactId: 'c1', kind: 'email', text: 'Sent deck' },
    { id: 'a3', contactId: 'c2', kind: 'note', text: 'Warm lead' },
  ]
  nextContactId = 4
  nextActivityId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function isKind(v: unknown): v is ActivityKind {
  return typeof v === 'string' && KINDS.includes(v as ActivityKind)
}

export function listCompanies(): Company[] {
  return companies.slice()
}

export function listContacts(filter?: { companyId?: string | null; tag?: string | null }): Contact[] {
  let out = contacts.slice()
  const companyId = filter?.companyId
  if (companyId) out = out.filter((c) => c.companyId === companyId)
  const tag = filter?.tag
  if (tag) out = out.filter((c) => c.tags.includes(tag))
  return out
}

export function findContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id)
}

export function createContact(input: {
  name: string
  companyId?: string
  tags?: string[]
}): Contact {
  const contact: Contact = {
    id: `c${nextContactId++}`,
    name: input.name,
    companyId: input.companyId ?? 'co1',
    tags: Array.isArray(input.tags) ? input.tags.slice() : [],
  }
  contacts.push(contact)
  return contact
}

export function addTag(id: string, tag: string): Contact | undefined {
  const contact = contacts.find((c) => c.id === id)
  if (!contact) return undefined
  if (!contact.tags.includes(tag)) contact.tags = [...contact.tags, tag]
  return contact
}

export function removeTag(id: string, tag: string): Contact | undefined {
  const contact = contacts.find((c) => c.id === id)
  if (!contact) return undefined
  contact.tags = contact.tags.filter((t) => t !== tag)
  return contact
}

export function deleteContact(id: string): boolean {
  const idx = contacts.findIndex((c) => c.id === id)
  if (idx === -1) return false
  contacts.splice(idx, 1)
  activities = activities.filter((a) => a.contactId !== id)
  return true
}

export function listActivities(contactId?: string | null): Activity[] {
  if (contactId) return activities.filter((a) => a.contactId === contactId)
  return activities.slice()
}

export function logActivity(input: {
  contactId: string
  kind: ActivityKind
  text: string
}): Activity {
  const activity: Activity = {
    id: `a${nextActivityId++}`,
    contactId: input.contactId,
    kind: input.kind,
    text: input.text,
  }
  activities.push(activity)
  return activity
}
