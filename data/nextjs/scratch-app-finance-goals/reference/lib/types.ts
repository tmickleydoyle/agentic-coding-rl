export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export interface BudgetEntry {
  id: string
  category: string
  amount: number
  month: string
}

export type Route = 'home' | 'goals' | 'budget' | 'reports'
