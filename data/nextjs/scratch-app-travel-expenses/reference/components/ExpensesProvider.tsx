'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_TRIPS: Trip[] = [
  { id: 'tr1', name: 'Paris', days: 3 },
  { id: 'tr2', name: 'Lisbon', days: 2 },
]

const SEED_EXPENSES: Expense[] = [
  { id: 'e1', tripId: 'tr1', day: 1, category: 'lodging', amount: 200, note: 'Hotel' },
  { id: 'e2', tripId: 'tr1', day: 1, category: 'food', amount: 50, note: 'Dinner' },
  { id: 'e3', tripId: 'tr1', day: 2, category: 'food', amount: 30, note: 'Lunch' },
  { id: 'e4', tripId: 'tr2', day: 1, category: 'transport', amount: 80, note: 'Train' },
]

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [trips] = useState<Trip[]>(SEED_TRIPS)
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('trips')
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<ExpensesApi>(() => {
    const addExpense = (input: NewExpenseInput) => {
      const id = `e${nextId}`
      setNextId((n) => n + 1)
      setExpenses((prev) => [
        ...prev,
        {
          id,
          tripId: input.tripId,
          day: input.day,
          category: input.category,
          amount: input.amount,
          note: input.note ?? '',
        },
      ])
    }

    const removeExpense = (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }

    const selectTrip = (id: string) => {
      setSelectedTripId(id)
      setRoute('expenses')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      trips,
      expenses,
      theme,
      route,
      selectedTripId,
      addExpense,
      removeExpense,
      selectTrip,
      setTheme,
      navigate,
    }
  }, [trips, expenses, theme, route, selectedTripId, nextId])

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
}

export function useExpenses(): ExpensesApi {
  const v = useContext(ExpensesContext)
  if (!v) throw new Error('useExpenses must be used within an ExpensesProvider')
  return v
}
