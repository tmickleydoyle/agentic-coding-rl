'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Expense, Route } from '../lib/types'

type Ctx = {
  expenses: Expense[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: string, amount: number) => void
  deleteExpense: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

const SEED: Expense[] = [
  { id: 1, vendor: 'Staples', category: 'Office', amount: 45.00 },
  { id: 2, vendor: 'Delta Airlines', category: 'Travel', amount: 320.50 },
  { id: 3, vendor: 'WeWork', category: 'Office', amount: 800.00 },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('expenses')
  const [nextId, setNextId] = useState(4)

  function addExpense(vendor: string, category: string, amount: number) {
    const v = vendor.trim()
    const c = category.trim()
    if (!v || !c || amount <= 0) return
    setExpenses((prev) => [...prev, { id: nextId, vendor: v, category: c, amount }])
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
