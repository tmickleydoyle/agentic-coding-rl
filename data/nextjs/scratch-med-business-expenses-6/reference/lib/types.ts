export type Category = 'Meals' | 'Travel' | 'Software' | 'Office' | 'Other'
export type Route = 'expenses' | 'summary' | 'settings'
export type Expense = { id: number; vendor: string; category: Category; amount: number }
