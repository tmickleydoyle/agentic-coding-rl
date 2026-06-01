export type Person = {
  id: string
  name: string
}

export type Expense = {
  id: string
  description: string
  amount: number
  paidBy: string
}

export type Route = 'dashboard' | 'expenses' | 'people' | 'balances'
export type Theme = 'light' | 'dark'
