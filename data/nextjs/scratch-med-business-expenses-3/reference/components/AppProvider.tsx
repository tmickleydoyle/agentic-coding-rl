'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Expense, Route, Category } from '../lib/types'

type Ctx = {
  expenses: Expense[]
  filter: Category | 'All'
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: Category, amount: number) => void
  deleteExpense: (id: number) => void
  setFilter: (f: Category | 'All') => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Omit<Expense, 'id'>[] = [
  { vendor: 'Acme Corp', category: 'Office', amount: 120.00 },
  { vendor: 'Fly Airlines', category: 'Travel', amount: 340.50 },
  { vendor: 'GitHub', category: 'Software', amount: 21.00 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(
    SEED.map((s, i) => ({ ...s, id: i + 1 }))
  )
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('expenses')
  const [nextId, setNextId] = useState(SEED.length + 1)

  function addExpense(vendor: string, category: Category, amount: number) {
    const v = vendor.trim()
    if (!v || amount <= 0) return
    setExpenses((prev) => [...prev, { id: nextId, vendor: v, category, amount }])
    setNextId((n) => n + 1)
  }

  function deleteExpense(id: number) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const value: Ctx = {
    expenses,
    filter,
    theme,
    route,
    navigate: setRoute,
    addExpense,
    deleteExpense,
    setFilter,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
