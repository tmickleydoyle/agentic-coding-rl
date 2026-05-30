export type Drink = {
  id: string
  date: string
  amount: number
}

export type DayTotal = {
  date: string
  total: number
}

export type Route = 'today' | 'history' | 'goal' | 'settings'
export type Theme = 'light' | 'dark'
