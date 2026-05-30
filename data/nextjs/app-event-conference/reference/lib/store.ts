import type { Session } from './types'
import { SLOTS } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let sessions: Session[] = []
let nextId = 5

function seed(): void {
  sessions = [
    { id: 's1', title: 'Intro to RL', track: 'AI', slot: '09:00', speaker: 'Ada' },
    { id: 's2', title: 'Vector DBs', track: 'Data', slot: '10:00', speaker: 'Grace' },
    { id: 's3', title: 'Edge Caching', track: 'Web', slot: '09:00', speaker: 'Linus' },
    { id: 's4', title: 'GPU Tuning', track: 'AI', slot: '11:00', speaker: 'Edsger' },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listSessions(filter?: {
  track?: string | null
  slot?: string | null
}): Session[] {
  let out = sessions.slice()
  const track = filter?.track
  if (track) out = out.filter((s) => s.track === track)
  const slot = filter?.slot
  if (slot) out = out.filter((s) => s.slot === slot)
  return out
}

export function isValidSlot(slot: string): boolean {
  return SLOTS.indexOf(slot) !== -1
}

export function createSession(input: {
  title: string
  track: string
  slot: string
  speaker: string
}): Session {
  const session: Session = {
    id: `s${nextId++}`,
    title: input.title,
    track: input.track,
    slot: input.slot,
    speaker: input.speaker,
  }
  sessions.push(session)
  return session
}

export function deleteSession(id: string): boolean {
  const idx = sessions.findIndex((s) => s.id === id)
  if (idx === -1) return false
  sessions.splice(idx, 1)
  return true
}
