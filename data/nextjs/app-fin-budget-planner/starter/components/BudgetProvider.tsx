'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Category, Currency, Expense, Route, Theme } from '../lib/types'

type NewExpenseInput = {
  categoryId: string
  amount: number
  note?: string
}

type BudgetApi = {
  categories: Category[]
  expenses: Expense[]
  theme: Theme
  currency: Currency
  route: Route
  addExpense: (input: NewExpenseInput) => void
  removeExpense: (id: string) => void
  addCategory: (input: { name: string; planned: number }) => void
  setTheme: (theme: Theme) => void
  setCurrency: (currency: Currency) => void
  navigate: (route: Route) => void
}

const BudgetContext = createContext<BudgetApi | null>(null)

const STUB: BudgetApi = {
  categories: [],
  expenses: [],
  theme: 'light',
  currency: 'USD',
  route: 'overview',
  addExpense: () => {},
  removeExpense: () => {},
  addCategory: () => {},
  setTheme: () => {},
  setCurrency: () => {},
  navigate: () => {},
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  // TODO: hold categories/expenses/theme/currency/route in state (seed 3 categories + 3
  // expenses), implement the actions, and provide them through BudgetContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <BudgetContext.Provider value={STUB}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetApi {
  const v = useContext(BudgetContext)
  if (!v) throw new Error('useBudget must be used within a BudgetProvider')
  return v
}
