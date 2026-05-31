import type { Destination } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `destinations` + an id counter; seed them; provide __reset()
// to re-seed (tests call __reset() in beforeEach for isolation).

export function __reset(): void {
  // TODO: re-seed the store to its initial 5 destinations
}

export function listDestinations(_filter?: { continent?: string | null; visited?: string | null }): Destination[] {
  // TODO: return destinations, optionally filtered by continent and/or visited ('true'/'false')
  return []
}

export function findDestination(_id: string): Destination | undefined {
  // TODO: look up a destination by id
  return undefined
}

export function createDestination(input: { name: string; country: string; continent: string; notes?: string }): Destination {
  // TODO: create + store a new destination (visited:false) and return it
  return { id: '', name: input.name, country: input.country, continent: input.continent, visited: false, notes: input.notes ?? '' }
}

export function updateVisited(_id: string, _visited?: boolean): Destination | undefined {
  // TODO: set/toggle visited for the destination and return it (undefined if not found)
  return undefined
}
