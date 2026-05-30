import type { Bin } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `bins` and an id counter; seed them; provide __reset() to re-seed.
// Reuse moveItem from ./move for moveBetween. Tests call __reset() in beforeEach.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listBins(_filter?: { available?: string | null }): Bin[] {
  // TODO: return bins, applying an optional available filter (free space > 0)
  return []
}

export function findBin(_id: string): Bin | undefined {
  // TODO: look up a bin by id
  return undefined
}

export function createBin(_input: { code: string; capacity: number }): Bin {
  // TODO: append a new empty bin with a fresh id and return it
  return { id: '', code: '', capacity: 0, items: [] }
}

export function moveBetween(
  _fromId: string,
  _toId: string,
  _name: string,
  _qty: number,
): { ok: boolean; error?: string } {
  // TODO: apply moveItem and commit the new bins on success
  return { ok: false, error: 'not implemented' }
}
