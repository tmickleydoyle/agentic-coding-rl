export type TxnType = 'income' | 'expense'
export type Route = 'transactions' | 'budgets' | 'reports' | 'settings'
export type Txn = { id: number; description: string; category: string; amount: number; type: TxnType }

export const BUDGETS: { name: string; limit: number }[] = [
  { name: 'Food', limit: 300 },
  { name: 'Transport', limit: 100 },
  { name: 'Fun', limit: 150 },
]
export const CATEGORIES = ['Food', 'Transport', 'Fun', 'Salary']
