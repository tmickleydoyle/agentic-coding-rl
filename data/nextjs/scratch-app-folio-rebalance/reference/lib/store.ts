import type { Holding } from './types'

// In-memory server store for the API routes. SEPARATE from the client RebalanceProvider state.
// Tests call __reset() in beforeEach for isolation.

let holdings: Holding[] = []
let nextId = 1

function seed(): void {
  holdings = [
    { id: 'h1', symbol: 'STOCKS', name: 'Stock Fund', value: 6000, targetPercent: 50 },
    { id: 'h2', symbol: 'BONDS', name: 'Bond Fund', value: 3000, targetPercent: 30 },
    { id: 'h3', symbol: 'CASH', name: 'Cash Reserve', value: 1000, targetPercent: 20 },
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
  value: number
  targetPercent: number
}): Holding {
  const holding: Holding = {
    id: `h${nextId++}`,
    symbol: input.symbol,
    name: input.name ?? input.symbol,
    value: input.value,
    targetPercent: input.targetPercent,
  }
  holdings.push(holding)
  return holding
}

export function updateTarget(id: string, targetPercent: number): Holding | undefined {
  const holding = holdings.find((h) => h.id === id)
  if (!holding) return undefined
  holding.targetPercent = targetPercent
  return holding
}

export function deleteHolding(id: string): boolean {
  const idx = holdings.findIndex((h) => h.id === id)
  if (idx === -1) return false
  holdings.splice(idx, 1)
  return true
}
