import type { Coin } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `coins` + id counter; seed them; provide __reset() to re-seed.
// Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listCoins(): Coin[] {
  // TODO: return all coins
  return []
}

export function findCoin(_id: string): Coin | undefined {
  // TODO: look up a coin by id
  return undefined
}

export function createCoin(_input: {
  symbol: string
  name?: string
  amount: number
  price: number
  change24h?: number
}): Coin {
  // TODO: append a new coin with a fresh id and return it
  return { id: '', symbol: '', name: '', amount: 0, price: 0, change24h: 0 }
}

export function deleteCoin(_id: string): boolean {
  // TODO: remove the coin; return whether it existed
  return false
}
