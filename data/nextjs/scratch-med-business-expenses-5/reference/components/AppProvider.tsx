'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Expense, Route, Category } from '../lib/types'

const SEED: Expense[] = [
  { id: 1, vendor: 'Acme Corp', category: 'Office', amount: 45.00 },
  { id: 2, vendor: 'Fly High', category: 'Travel', amount: 320.50 },
  { id: 3, vendor: 'Lunch Spot', category: 'Food', amount: 18.75 },
]

type Ctx = {
  expenses: Expense[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addExpense: (vendor: string, category: Category, amount: number) => void
  deleteExpense: (id: number) => void
  clearAll: () => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

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

  function clearAll() {
    setExpenses([])
  }

  const value: Ctx = {
    expenses,
    theme,
    route,
    navigate: setRoute,
    addExpense,
    deleteExpense,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
