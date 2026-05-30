import type { Filter, Party } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `parties` (seed via seedParties()); provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listParties(): Party[] {
  // TODO: return all parties (copy)
  return []
}

export function findParty(_id: string): Party | undefined {
  // TODO: look up a party by id
  return undefined
}

export function statusOf(_party: Party): Filter {
  // TODO: 'upcoming' if time > NOW else 'past'
  return 'past'
}

export function filterParties(_filter: Filter): Party[] {
  // TODO: parties matching the filter
  return []
}

export function createParty(_title: string, _time: number): Party {
  // TODO: append a new party with id p<N> and return it
  return { id: '', title: '', time: 0, rsvped: false, queue: [] }
}

export function deleteParty(_id: string): boolean {
  // TODO: remove the party; return whether it existed
  return false
}
