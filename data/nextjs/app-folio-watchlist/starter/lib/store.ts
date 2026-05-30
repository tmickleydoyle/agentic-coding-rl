import type { Ticker } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `tickers` + id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listTickers(_filter?: { alertsOnly?: boolean }): Ticker[] {
  // TODO: return tickers, optionally filtered to alert hits
  return []
}

export function alertHit(_ticker: Ticker): boolean {
  // TODO: above => price >= target; below => price <= target
  return false
}

export function findTicker(_id: string): Ticker | undefined {
  // TODO: look up a ticker by id
  return undefined
}

export function createTicker(_input: {
  symbol: string
  name?: string
  price: number
  targetPrice: number
  direction?: 'above' | 'below'
}): Ticker {
  // TODO: append a new ticker with a fresh id and return it
  return { id: '', symbol: '', name: '', price: 0, targetPrice: 0, direction: 'above' }
}

export function deleteTicker(_id: string): boolean {
  // TODO: remove the ticker; return whether it existed
  return false
}
