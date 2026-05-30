import type { Coin } from './types'

// In-memory server store for the API routes. SEPARATE from the client PortfolioProvider state.
// Tests call __reset() in beforeEach for isolation.

let coins: Coin[] = []
let nextId = 1

function seed(): void {
  coins = [
    { id: 'c1', symbol: 'BTC', name: 'Bitcoin', amount: 0.5, price: 60000, change24h: 5 },
    { id: 'c2', symbol: 'ETH', name: 'Ethereum', amount: 4, price: 3000, change24h: -2 },
    { id: 'c3', symbol: 'SOL', name: 'Solana', amount: 50, price: 100, change24h: 10 },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listCoins(): Coin[] {
  return coins.slice()
}

export function findCoin(id: string): Coin | undefined {
  return coins.find((c) => c.id === id)
}

export function createCoin(input: {
  symbol: string
  name?: string
  amount: number
  price: number
  change24h?: number
}): Coin {
  const coin: Coin = {
    id: `c${nextId++}`,
    symbol: input.symbol,
    name: input.name ?? input.symbol,
    amount: input.amount,
    price: input.price,
    change24h: input.change24h ?? 0,
  }
  coins.push(coin)
  return coin
}

export function deleteCoin(id: string): boolean {
  const idx = coins.findIndex((c) => c.id === id)
  if (idx === -1) return false
  coins.splice(idx, 1)
  return true
}
