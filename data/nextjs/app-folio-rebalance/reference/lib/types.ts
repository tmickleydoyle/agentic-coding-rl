export type Holding = {
  id: string
  symbol: string
  name: string
  value: number // current (static seed) market value
  targetPercent: number // desired allocation (0-100)
}

export type RebalanceEntry = {
  id: string
  symbol: string
  date: string
  action: 'BUY' | 'SELL'
  amount: number
}

export type Route = 'portfolio' | 'targets' | 'rebalance' | 'history'
export type Theme = 'light' | 'dark'

export type Action = 'BUY' | 'SELL' | 'HOLD'
