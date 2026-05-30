'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Expense, Person, Route, Theme } from '../lib/types'

type NewExpenseInput = {
  description: string
  amount: number
  paidBy: string
}

type SplitApi = {
  people: Person[]
  expenses: Expense[]
  theme: Theme
  route: Route
  addExpense: (input: NewExpenseInput) => void
  removeExpense: (id: string) => void
  addPerson: (name: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const SplitContext = createContext<SplitApi | null>(null)

const STUB: SplitApi = {
  people: [],
  expenses: [],
  theme: 'light',
  route: 'dashboard',
  addExpense: () => {},
  removeExpense: () => {},
  addPerson: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function SplitProvider({ children }: { children: ReactNode }) {
  // TODO: hold people/expenses/theme/route in state (seed 3 people + 3 expenses), implement
  // the actions, and provide them through SplitContext. The STUB below makes the app mount
  // but does nothing — replace it with real state + actions.
  return <SplitContext.Provider value={STUB}>{children}</SplitContext.Provider>
}

export function useSplit(): SplitApi {
  const v = useContext(SplitContext)
  if (!v) throw new Error('useSplit must be used within a SplitProvider')
  return v
}
