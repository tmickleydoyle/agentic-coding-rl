'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Rent', planned: 1200 },
  { id: 'c2', name: 'Groceries', planned: 400 },
  { id: 'c3', name: 'Transport', planned: 150 },
]

const SEED_EXPENSES: Expense[] = [
  { id: 'e1', categoryId: 'c1', amount: 1200, note: 'May rent' },
  { id: 'e2', categoryId: 'c2', amount: 320, note: 'Weekly shop' },
  { id: 'e3', categoryId: 'c2', amount: 140, note: 'Costco' },
]

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES)
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES)
  const [theme, setTheme] = useState<Theme>('light')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [route, setRoute] = useState<Route>('overview')
  const [nextExpenseId, setNextExpenseId] = useState(4)
  const [nextCategoryId, setNextCategoryId] = useState(4)

  const value = useMemo<BudgetApi>(() => {
    const addExpense = (input: NewExpenseInput) => {
      const id = `e${nextExpenseId}`
      setNextExpenseId((n) => n + 1)
      setExpenses((prev) => [
        ...prev,
        {
          id,
          categoryId: input.categoryId,
          amount: input.amount,
          note: input.note ?? '',
        },
      ])
    }

    const removeExpense = (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }

    const addCategory = (input: { name: string; planned: number }) => {
      const id = `c${nextCategoryId}`
      setNextCategoryId((n) => n + 1)
      setCategories((prev) => [...prev, { id, name: input.name, planned: input.planned }])
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      categories,
      expenses,
      theme,
      currency,
      route,
      addExpense,
      removeExpense,
      addCategory,
      setTheme,
      setCurrency,
      navigate,
    }
  }, [categories, expenses, theme, currency, route, nextExpenseId, nextCategoryId])

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetApi {
  const v = useContext(BudgetContext)
  if (!v) throw new Error('useBudget must be used within a BudgetProvider')
  return v
}
