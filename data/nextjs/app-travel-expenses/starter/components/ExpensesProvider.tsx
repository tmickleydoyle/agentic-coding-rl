'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Category, Expense, Route, Theme, Trip } from '../lib/types'

type NewExpenseInput = {
  tripId: string
  day: number
  category: Category
  amount: number
  note?: string
}

type ExpensesApi = {
  trips: Trip[]
  expenses: Expense[]
  theme: Theme
  route: Route
  selectedTripId: string | null
  addExpense: (input: NewExpenseInput) => void
  removeExpense: (id: string) => void
  selectTrip: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const ExpensesContext = createContext<ExpensesApi | null>(null)

const STUB: ExpensesApi = {
  trips: [],
  expenses: [],
  theme: 'light',
  route: 'trips',
  selectedTripId: null,
  addExpense: () => {},
  removeExpense: () => {},
  selectTrip: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  // TODO: hold trips/expenses/theme/route/selectedTripId in state (seed 2 trips + 4
  // expenses), implement the actions, and provide them through ExpensesContext.
  return <ExpensesContext.Provider value={STUB}>{children}</ExpensesContext.Provider>
}

export function useExpenses(): ExpensesApi {
  const v = useContext(ExpensesContext)
  if (!v) throw new Error('useExpenses must be used within an ExpensesProvider')
  return v
}
