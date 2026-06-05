export type Direction = 'above' | 'below'

export type Ticker = {
  id: string
  symbol: string
  name: string
  price: number // current (static seed) price
  targetPrice: number
  direction: Direction // alert when price crosses target in this direction
}

export type Route = 'watchlist' | 'ticker-detail' | 'add' | 'alerts'
export type Theme = 'light' | 'dark'
