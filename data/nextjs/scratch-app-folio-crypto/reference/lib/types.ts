export type Coin = {
  id: string
  symbol: string
  name: string
  amount: number // units held
  price: number // current (static seed) price per unit
  change24h: number // static 24h change as a percent (e.g. 5 = +5%)
}

export type Route = 'portfolio' | 'coin-detail' | 'add' | 'allocation'
export type Theme = 'light' | 'dark'
