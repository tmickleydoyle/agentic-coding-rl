'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Category, Currency, Route, Theme, Transaction } from '../lib/types'

type NewTxnInput = {
  categoryId: string
  description?: string
  amount: number
}

type BudgetApi = {
  categories: Category[]
  transactions: Transaction[]
  theme: Theme
  currency: Currency
  route: Route
  addTransaction: (input: NewTxnInput) => void
  removeTransaction: (id: string) => void
  setLimit: (categoryId: string, limit: number) => void
  setTheme: (theme: Theme) => void
  setCurrency: (currency: Currency) => void
  navigate: (route: Route) => void
}

const BudgetContext = createContext<BudgetApi | null>(null)

const STUB: BudgetApi = {
  categories: [],
  transactions: [],
  theme: 'light',
  currency: 'USD',
  route: 'overview',
  addTransaction: () => {},
  removeTransaction: () => {},
  setLimit: () => {},
  setTheme: () => {},
  setCurrency: () => {},
  navigate: () => {},
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  // TODO: hold categories/transactions/theme/currency/route in state (seed 3 categories + 5
  // transactions), implement addTransaction/removeTransaction/setLimit and navigation. The
  // STUB below makes the app mount but does nothing — replace it with real state + actions.
  return <BudgetContext.Provider value={STUB}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetApi {
  const v = useContext(BudgetContext)
  if (!v) throw new Error('useBudget must be used within a BudgetProvider')
  return v
}
