import type { Holding } from './types'

// In-memory server store for the API routes. SEPARATE from the client DividendsProvider state.
// Tests call __reset() in beforeEach for isolation.

let holdings: Holding[] = []
let nextId = 1

function seed(): void {
  holdings = [
    { id: 'h1', symbol: 'KO', name: 'Coca-Cola', shares: 100, dividendPerShare: 2, payMonth: 3 },
    { id: 'h2', symbol: 'JNJ', name: 'Johnson & Johnson', shares: 50, dividendPerShare: 4, payMonth: 6 },
    { id: 'h3', symbol: 'PEP', name: 'PepsiCo', shares: 30, dividendPerShare: 5, payMonth: 3 },
    { id: 'h4', symbol: 'VZ', name: 'Verizon', shares: 100, dividendPerShare: 3, payMonth: 12 },
  ]
  nextId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listHoldings(filter?: { payMonth?: number | null }): Holding[] {
  let out = holdings.slice()
  const payMonth = filter?.payMonth
  if (payMonth != null) out = out.filter((h) => h.payMonth === payMonth)
  return out
}

export function findHolding(id: string): Holding | undefined {
  return holdings.find((h) => h.id === id)
}

export function createHolding(input: {
  symbol: string
  name?: string
  shares: number
  dividendPerShare: number
  payMonth?: number
}): Holding {
  const holding: Holding = {
    id: `h${nextId++}`,
    symbol: input.symbol,
    name: input.name ?? input.symbol,
    shares: input.shares,
    dividendPerShare: input.dividendPerShare,
    payMonth: input.payMonth ?? 1,
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
