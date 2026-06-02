export type Category = 'Food' | 'Travel' | 'Supplies' | 'Software' | 'Other'
export type Route = 'expenses' | 'summary' | 'settings'
export type Expense = { id: number; vendor: string; category: Category; amount: number }
export const CATEGORIES: Category[] = ['Food', 'Travel', 'Supplies', 'Software', 'Other']
