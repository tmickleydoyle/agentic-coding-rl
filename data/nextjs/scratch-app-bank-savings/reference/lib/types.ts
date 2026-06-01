export type Pot = {
  id: string
  name: string
  balance: number
  goal: number
}

export type Route = 'pots' | 'pot-detail' | 'create' | 'settings'
export type Theme = 'light' | 'dark'
export type Currency = 'USD' | 'EUR' | 'GBP'
