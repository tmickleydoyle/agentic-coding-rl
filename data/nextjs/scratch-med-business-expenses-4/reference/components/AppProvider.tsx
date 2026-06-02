'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Expense, Route } from '../lib/types'

type Ctx = {
  expenses: Expense[]
  filter: Category | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: Category, amount: number) => void
  setFilter: (f: Category | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('expenses')
  const [nextId, setNextId] = useState(1)

  function addExpense(vendor: string, category: Category, amount: number) {
    const v = vendor.trim()
    if (!v || amount <= 0) return
    setExpenses((e) => [...e, { id: nextId, vendor: v, category, amount }])
    setNextId((n) => n + 1)
  }

  const value: Ctx = {
    expenses,
    filter,
    theme,
    route,
    navigate: setRoute,
    addExpense,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
