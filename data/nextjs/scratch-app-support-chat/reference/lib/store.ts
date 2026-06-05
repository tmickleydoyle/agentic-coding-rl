import type { Message, Session } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state — the API has its own seed data and lifecycle. Tests call
// __reset() in beforeEach so each test starts from the same seed.

let sessions: Session[] = []
let nextId = 1
let nextMsgId = 1

function seed(): void {
  sessions = [
    { id: 's1', visitor: 'dana', topic: 'Cannot check out', status: 'waiting', agent: null, messages: [{ id: 'm1', from: 'visitor', text: 'Hi, my cart is stuck.' }] },
    { id: 's2', visitor: 'evan', topic: 'Refund status', status: 'active', agent: 'alice', messages: [{ id: 'm2', from: 'agent', text: 'Hello, how can I help?' }] },
    { id: 's3', visitor: 'fran', topic: 'Password help', status: 'closed', agent: 'bob', messages: [] },
    { id: 's4', visitor: 'gita', topic: 'Shipping delay', status: 'waiting', agent: null, messages: [] },
    { id: 's5', visitor: 'hank', topic: 'Account locked', status: 'active', agent: 'alice', messages: [] },
  ]
  nextId = 6
  nextMsgId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listSessions(filter?: { status?: string | null }): Session[] {
  let out = sessions.slice()
  const status = filter?.status
  if (status === 'waiting' || status === 'active' || status === 'closed') {
    out = out.filter((s) => s.status === status)
  }
  return out
}

export function createSession(input: { visitor: string; topic?: string }): Session {
  const session: Session = {
    id: `s${nextId++}`,
    visitor: input.visitor,
    topic: input.topic ?? '',
    status: 'waiting',
    agent: null,
    messages: [],
  }
  sessions.push(session)
  return session
}

export function findSession(id: string): Session | undefined {
  return sessions.find((s) => s.id === id)
}

export function assignSession(id: string, agent: string): Session | undefined {
  const session = sessions.find((s) => s.id === id)
  if (!session) return undefined
  session.agent = agent
  session.status = 'active'
  return session
}

export function closeSession(id: string): Session | undefined {
  const session = sessions.find((s) => s.id === id)
  if (!session) return undefined
  session.status = 'closed'
  return session
}

export function addMessage(
  id: string,
  input: { from: 'visitor' | 'agent'; text: string },
): Session | undefined {
  const session = sessions.find((s) => s.id === id)
  if (!session) return undefined
  const m: Message = { id: `m${nextMsgId++}`, from: input.from, text: input.text }
  session.messages.push(m)
  return session
}

export function deleteSession(id: string): boolean {
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx === -1) return false
  sessions.splice(idx, 1)
  return true
}
