export type Holding = {
  id: string
  symbol: string
  name: string
  shares: number
  costBasis: number // per-share purchase price
  price: number // current (static seed) price per share
}

export type Route = 'portfolio' | 'holding-detail' | 'add' | 'allocation'
export type Theme = 'light' | 'dark'
