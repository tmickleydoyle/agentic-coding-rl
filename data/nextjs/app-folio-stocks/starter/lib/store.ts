import type { Holding } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `holdings` + id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listHoldings(): Holding[] {
  // TODO: return all holdings
  return []
}

export function findHolding(_id: string): Holding | undefined {
  // TODO: look up a holding by id
  return undefined
}

export function createHolding(_input: {
  symbol: string
  name?: string
  shares: number
  costBasis: number
  price?: number
}): Holding {
  // TODO: append a new holding with a fresh id and return it
  return { id: '', symbol: '', name: '', shares: 0, costBasis: 0, price: 0 }
}

export function deleteHolding(_id: string): boolean {
  // TODO: remove the holding; return whether it existed
  return false
}
