import type { Direction, Ticker } from './types'

// In-memory server store for the API routes. SEPARATE from the client WatchlistProvider state.
// Tests call __reset() in beforeEach for isolation.

let tickers: Ticker[] = []
let nextId = 1

function seed(): void {
  tickers = [
    { id: 't1', symbol: 'AAPL', name: 'Apple Inc.', price: 200, targetPrice: 180, direction: 'above' },
    { id: 't2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 400, targetPrice: 450, direction: 'above' },
    { id: 't3', symbol: 'GOOG', name: 'Alphabet Inc.', price: 150, targetPrice: 160, direction: 'below' },
    { id: 't4', symbol: 'NVDA', name: 'Nvidia Corp.', price: 120, targetPrice: 100, direction: 'below' },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listTickers(filter?: { alertsOnly?: boolean }): Ticker[] {
  let out = tickers.slice()
  if (filter?.alertsOnly) out = out.filter((t) => alertHit(t))
  return out
}

export function alertHit(ticker: Ticker): boolean {
  return ticker.direction === 'above'
    ? ticker.price >= ticker.targetPrice
    : ticker.price <= ticker.targetPrice
}

export function findTicker(id: string): Ticker | undefined {
  return tickers.find((t) => t.id === id)
}

export function createTicker(input: {
  symbol: string
  name?: string
  price: number
  targetPrice: number
  direction?: Direction
}): Ticker {
  const ticker: Ticker = {
    id: `t${nextId++}`,
    symbol: input.symbol,
    name: input.name ?? input.symbol,
    price: input.price,
    targetPrice: input.targetPrice,
    direction: input.direction ?? 'above',
  }
  tickers.push(ticker)
  return ticker
}

export function deleteTicker(id: string): boolean {
  const idx = tickers.findIndex((t) => t.id === id)
  if (idx === -1) return false
  tickers.splice(idx, 1)
  return true
}
