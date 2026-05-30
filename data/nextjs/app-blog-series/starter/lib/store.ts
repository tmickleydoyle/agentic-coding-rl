import type { Part, Series } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `series`, `parts`, and an id counter; seed them; provide
// __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listSeries(): Series[] {
  // TODO: return all series
  return []
}

export function findSeries(_id: string): Series | undefined {
  // TODO: look up a series by id
  return undefined
}

export function listParts(_seriesId?: string | null): Part[] {
  // TODO: return parts, optionally filtered by seriesId and sorted by order
  return []
}

export function createPart(_input: { seriesId: string; title: string }): Part {
  // TODO: append a new part with a fresh id and the next order; return it
  return { id: '', seriesId: '', order: 0, title: '', read: false }
}

export function findPart(_id: string): Part | undefined {
  // TODO: look up a part by id
  return undefined
}

export function updatePart(_id: string, _patch: { read?: boolean }): Part | undefined {
  // TODO: apply the patch and return the updated part, or undefined if absent
  return undefined
}
