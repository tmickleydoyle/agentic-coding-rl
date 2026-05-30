import type { DM, Person, Thread } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let people: Person[] = []
let threads: Thread[] = []
let dms: DM[] = []
let nextThreadId = 1

function seed(): void {
  people = [
    { id: 'u1', name: 'You', handle: '@you' },
    { id: 'u2', name: 'Ada', handle: '@ada' },
    { id: 'u3', name: 'Linus', handle: '@linus' },
    { id: 'u4', name: 'Grace', handle: '@grace' },
  ]
  threads = [
    { id: 't1', personId: 'u2', unread: true },
    { id: 't2', personId: 'u3', unread: false },
    { id: 't3', personId: 'u4', unread: true },
  ]
  dms = [
    { id: 'd1', threadId: 't1', authorId: 'u2', text: 'Hey there' },
    { id: 'd2', threadId: 't1', authorId: 'u1', text: 'Hi Ada' },
    { id: 'd3', threadId: 't2', authorId: 'u3', text: 'Ship it' },
    { id: 'd4', threadId: 't3', authorId: 'u4', text: 'Coffee?' },
  ]
  nextThreadId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listPeople(): Person[] {
  return people.slice()
}

export function listThreads(filter?: { unread?: boolean }): Thread[] {
  let out = threads.slice()
  if (filter?.unread) out = out.filter((t) => t.unread)
  return out
}

export function createThread(input: { personId: string }): Thread {
  const thread: Thread = {
    id: `t${nextThreadId++}`,
    personId: input.personId,
    unread: false,
  }
  threads.push(thread)
  return thread
}

export function findThread(id: string): Thread | undefined {
  return threads.find((t) => t.id === id)
}

export function setUnread(id: string, unread?: boolean): Thread | undefined {
  const thread = threads.find((t) => t.id === id)
  if (!thread) return undefined
  thread.unread = typeof unread === 'boolean' ? unread : !thread.unread
  return thread
}

export function deleteThread(id: string): boolean {
  const idx = threads.findIndex((t) => t.id === id)
  if (idx === -1) return false
  threads.splice(idx, 1)
  return true
}

export function listDMs(threadId: string): DM[] {
  return dms.filter((d) => d.threadId === threadId)
}
