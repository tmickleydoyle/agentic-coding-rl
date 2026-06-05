import type { Filter, Party } from './types'
import { NOW } from './types'
import { seedParties } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let parties: Party[] = []

function seed(): void {
  parties = seedParties()
}

seed()

export function __reset(): void {
  seed()
}

export function listParties(): Party[] {
  return parties.map((p) => ({ ...p, queue: p.queue.slice() }))
}

export function findParty(id: string): Party | undefined {
  return parties.find((p) => p.id === id)
}

export function statusOf(party: Party): Filter {
  return party.time > NOW ? 'upcoming' : 'past'
}

export function filterParties(filter: Filter): Party[] {
  return listParties().filter((p) => statusOf(p) === filter)
}

export function createParty(title: string, time: number): Party {
  const party: Party = {
    id: `p${parties.length + 1}`,
    title,
    time,
    rsvped: false,
    queue: [],
  }
  parties.push(party)
  return { ...party, queue: party.queue.slice() }
}

export function deleteParty(id: string): boolean {
  const idx = parties.findIndex((p) => p.id === id)
  if (idx === -1) return false
  parties.splice(idx, 1)
  return true
}
