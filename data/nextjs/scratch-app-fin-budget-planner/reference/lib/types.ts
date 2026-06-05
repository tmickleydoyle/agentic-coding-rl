export type Category = {
  id: string
  name: string
  planned: number
}

export type Expense = {
  id: string
  categoryId: string
  amount: number
  note: string
}

export type Route = 'overview' | 'categories' | 'add-expense' | 'settings'
export type Theme = 'light' | 'dark'
export type Currency = 'USD' | 'EUR' | 'GBP'
