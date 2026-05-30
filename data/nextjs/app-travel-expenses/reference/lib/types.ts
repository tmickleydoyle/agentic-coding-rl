export type Category = 'food' | 'lodging' | 'transport' | 'activities' | 'other'

export type Expense = {
  id: string
  tripId: string
  day: number
  category: Category
  amount: number
  note: string
}

export type Trip = {
  id: string
  name: string
  days: number
}

export type Route = 'trips' | 'expenses' | 'add' | 'summary'
export type Theme = 'light' | 'dark'

export const CATEGORIES: Category[] = [
  'food',
  'lodging',
  'transport',
  'activities',
  'other',
]
