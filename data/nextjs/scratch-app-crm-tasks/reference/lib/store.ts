import type { Contact, FollowUp } from './types'

// In-memory server store for the API routes. SEPARATE from the client state.
// Tests call __reset() in beforeEach for isolation.

let contacts: Contact[] = []
let followups: FollowUp[] = []
let nextId = 1

function seed(): void {
  contacts = [
    { id: 'c1', name: 'Ada Byron' },
    { id: 'c2', name: 'Grace Hopper' },
    { id: 'c3', name: 'Linus T' },
  ]
  followups = [
    { id: 't1', title: 'Call Ada', contactId: 'c1', dueDate: '2026-05-30', done: false },
    { id: 't2', title: 'Email Grace', contactId: 'c2', dueDate: '2026-06-01', done: false },
    { id: 't3', title: 'Demo for Ada', contactId: 'c1', dueDate: '2026-06-05', done: false },
    { id: 't4', title: 'Send quote', contactId: 'c2', dueDate: '2026-06-01', done: true },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listContacts(): Contact[] {
  return contacts.slice()
}

export function listFollowUps(filter?: { done?: boolean | null; contactId?: string | null }): FollowUp[] {
  let out = followups.slice()
  const done = filter?.done
  if (done === true || done === false) out = out.filter((f) => f.done === done)
  const contactId = filter?.contactId
  if (contactId) out = out.filter((f) => f.contactId === contactId)
  return out
}

export function findFollowUp(id: string): FollowUp | undefined {
  return followups.find((f) => f.id === id)
}

export function createFollowUp(input: {
  title: string
  contactId?: string
  dueDate?: string
}): FollowUp {
  const followup: FollowUp = {
    id: `t${nextId++}`,
    title: input.title,
    contactId: input.contactId ?? 'c1',
    dueDate: input.dueDate ?? '2026-06-01',
    done: false,
  }
  followups.push(followup)
  return followup
}

export function updateFollowUp(
  id: string,
  patch: { done?: boolean; dueDate?: string; title?: string },
): FollowUp | undefined {
  const followup = followups.find((f) => f.id === id)
  if (!followup) return undefined
  if (typeof patch.done === 'boolean') followup.done = patch.done
  if (typeof patch.dueDate === 'string') followup.dueDate = patch.dueDate
  if (typeof patch.title === 'string') followup.title = patch.title
  return followup
}

export function toggleFollowUp(id: string): FollowUp | undefined {
  const followup = followups.find((f) => f.id === id)
  if (!followup) return undefined
  followup.done = !followup.done
  return followup
}

export function deleteFollowUp(id: string): boolean {
  const idx = followups.findIndex((f) => f.id === id)
  if (idx === -1) return false
  followups.splice(idx, 1)
  return true
}

export function countsByContact(): Array<Contact & { open: number; total: number }> {
  return contacts.map((c) => {
    const mine = followups.filter((f) => f.contactId === c.id)
    return {
      ...c,
      total: mine.length,
      open: mine.filter((f) => !f.done).length,
    }
  })
}
