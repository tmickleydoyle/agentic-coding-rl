export type Category = {
  id: string
  name: string
  limit: number
}

export type Transaction = {
  id: string
  categoryId: string
  description: string
  amount: number
}

export type Route = 'overview' | 'categories' | 'transactions' | 'budgets'
export type Theme = 'light' | 'dark'
export type Currency = 'USD' | 'EUR' | 'GBP'
