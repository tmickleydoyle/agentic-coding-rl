'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Expense, Category, Route } from '../lib/types'

const SEED: Expense[] = [
  { id: 1, vendor: 'Acme Corp', category: 'Supplies', amount: 45.00 },
  { id: 2, vendor: 'Jet Airways', category: 'Travel', amount: 200.00 },
  { id: 3, vendor: 'Lunch Spot', category: 'Food', amount: 18.75 },
]

type Ctx = {
  expenses: Expense[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: Category, amount: string) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(SEED)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('expenses')
  const [nextId, setNextId] = useState(4)

  function addExpense(vendor: string, category: Category, amount: string) {
    const v = vendor.trim()
    if (!v) return
    const a = parseFloat(amount)
    if (isNaN(a) || a <= 0) return
    setExpenses((prev) => [...prev, { id: nextId, vendor: v, category, amount: a }])
    setNextId((n) => n + 1)
  }

  function clearAll() {
    setExpenses([])
  }

  const value: Ctx = {
    expenses,
    theme,
    route,
    navigate: setRoute,
    addExpense,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
