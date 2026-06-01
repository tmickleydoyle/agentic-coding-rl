import type { Holding } from './types'

// In-memory server store for the API routes. SEPARATE from the client PortfolioProvider state.
// Tests call __reset() in beforeEach for isolation.

let holdings: Holding[] = []
let nextId = 1

function seed(): void {
  holdings = [
    { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', shares: 10, costBasis: 150, price: 200 },
    { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, costBasis: 300, price: 400 },
    { id: 'h3', symbol: 'TSLA', name: 'Tesla Inc.', shares: 8, costBasis: 250, price: 200 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listHoldings(): Holding[] {
  return holdings.slice()
}

export function findHolding(id: string): Holding | undefined {
  return holdings.find((h) => h.id === id)
}

export function createHolding(input: {
  symbol: string
  name?: string
  shares: number
  costBasis: number
  price?: number
}): Holding {
  const holding: Holding = {
    id: `h${nextId++}`,
    symbol: input.symbol,
    name: input.name ?? input.symbol,
    shares: input.shares,
    costBasis: input.costBasis,
    price: input.price ?? input.costBasis,
  }
  holdings.push(holding)
  return holding
}

export function deleteHolding(id: string): boolean {
  const idx = holdings.findIndex((h) => h.id === id)
  if (idx === -1) return false
  holdings.splice(idx, 1)
  return true
}
