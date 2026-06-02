'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Category, Expense, Route } from '../lib/types'

type Ctx = {
  expenses: Expense[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: Category, amount: number) => void
  deleteExpense: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Expense[] = [
  { id: 1, vendor: 'Acme Corp', category: 'Office', amount: 45.00 },
  { id: 2, vendor: 'Delta Air', category: 'Travel', amount: 320.75 },
  { id: 3, vendor: 'GitHub', category: 'Software', amount: 9.99 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('expenses')
  const [nextId, setNextId] = useState(4)

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
    theme,
    route,
    navigate: setRoute,
    addExpense,
    deleteExpense,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
