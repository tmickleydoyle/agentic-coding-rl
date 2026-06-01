import type { Entry, Member } from './types'
import { TODAY } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let members: Member[] = []
let entries: Entry[] = []
let nextId = 1

function seed(): void {
  members = [
    { id: 'm1', name: 'Ada' },
    { id: 'm2', name: 'Grace' },
    { id: 'm3', name: 'Linus' },
  ]
  entries = [
    {
      id: 'e1',
      memberId: 'm1',
      date: '2026-05-28',
      yesterday: 'Drafted spec',
      today: 'Implement API',
      blocker: 'Waiting on review',
    },
    {
      id: 'e2',
      memberId: 'm2',
      date: '2026-05-28',
      yesterday: 'Fixed bug',
      today: 'Write tests',
      blocker: null,
    },
    {
      id: 'e3',
      memberId: 'm1',
      date: TODAY,
      yesterday: 'Implement API',
      today: 'Review PRs',
      blocker: null,
    },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listMembers(): Member[] {
  return members.slice()
}

export function listEntries(filter?: {
  date?: string | null
  memberId?: string | null
  blockers?: boolean
}): Entry[] {
  let out = entries.slice()
  if (filter?.date) out = out.filter((e) => e.date === filter.date)
  if (filter?.memberId) out = out.filter((e) => e.memberId === filter.memberId)
  if (filter?.blockers) out = out.filter((e) => e.blocker !== null)
  return out
}

export function createEntry(input: {
  memberId: string
  date?: string
  yesterday: string
  today: string
  blocker?: string | null
}): Entry {
  const rawBlocker = input.blocker
  const blocker =
    typeof rawBlocker === 'string' && rawBlocker.trim().length > 0 ? rawBlocker.trim() : null
  const entry: Entry = {
    id: `e${nextId++}`,
    memberId: input.memberId,
    date: input.date ?? TODAY,
    yesterday: input.yesterday,
    today: input.today,
    blocker,
  }
  entries.push(entry)
  return entry
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}
