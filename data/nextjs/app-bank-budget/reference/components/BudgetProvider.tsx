'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Dining', limit: 300 },
  { id: 'c2', name: 'Shopping', limit: 500 },
  { id: 'c3', name: 'Utilities', limit: 200 },
]

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', categoryId: 'c1', description: 'Pizza night', amount: 60 },
  { id: 't2', categoryId: 'c1', description: 'Sushi', amount: 120 },
  { id: 't3', categoryId: 'c2', description: 'New shoes', amount: 540 },
  { id: 't4', categoryId: 'c3', description: 'Electricity', amount: 90 },
  { id: 't5', categoryId: 'c3', description: 'Water', amount: 60 },
]

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES)
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS)
  const [theme, setTheme] = useState<Theme>('light')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [route, setRoute] = useState<Route>('overview')
  const [nextTxnId, setNextTxnId] = useState(6)

  const value = useMemo<BudgetApi>(() => {
    const addTransaction = (input: NewTxnInput) => {
      const id = `t${nextTxnId}`
      setNextTxnId((n) => n + 1)
      setTransactions((prev) => [
        ...prev,
        {
          id,
          categoryId: input.categoryId,
          description: input.description ?? '',
          amount: input.amount,
        },
      ])
    }

    const removeTransaction = (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    }

    const setLimit = (categoryId: string, limit: number) => {
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, limit } : c)),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      categories,
      transactions,
      theme,
      currency,
      route,
      addTransaction,
      removeTransaction,
      setLimit,
      setTheme,
      setCurrency,
      navigate,
    }
  }, [categories, transactions, theme, currency, route, nextTxnId])

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetApi {
  const v = useContext(BudgetContext)
  if (!v) throw new Error('useBudget must be used within a BudgetProvider')
  return v
}
