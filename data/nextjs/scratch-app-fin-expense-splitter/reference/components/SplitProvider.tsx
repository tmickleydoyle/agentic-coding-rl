'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_PEOPLE: Person[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
  { id: 'u3', name: 'Carol' },
]

const SEED_EXPENSES: Expense[] = [
  { id: 'e1', description: 'Dinner', amount: 90, paidBy: 'u1' },
  { id: 'e2', description: 'Taxi', amount: 30, paidBy: 'u2' },
  { id: 'e3', description: 'Hotel', amount: 60, paidBy: 'u1' },
]

export function SplitProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(SEED_PEOPLE)
  const [expenses, setExpenses] = useState<Expense[]>(SEED_EXPENSES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('dashboard')
  const [nextExpenseId, setNextExpenseId] = useState(4)
  const [nextPersonId, setNextPersonId] = useState(4)

  const value = useMemo<SplitApi>(() => {
    const addExpense = (input: NewExpenseInput) => {
      const id = `e${nextExpenseId}`
      setNextExpenseId((n) => n + 1)
      setExpenses((prev) => [
        ...prev,
        {
          id,
          description: input.description,
          amount: input.amount,
          paidBy: input.paidBy,
        },
      ])
    }

    const removeExpense = (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    }

    const addPerson = (name: string) => {
      const id = `u${nextPersonId}`
      setNextPersonId((n) => n + 1)
      setPeople((prev) => [...prev, { id, name }])
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      people,
      expenses,
      theme,
      route,
      addExpense,
      removeExpense,
      addPerson,
      setTheme,
      navigate,
    }
  }, [people, expenses, theme, route, nextExpenseId, nextPersonId])

  return <SplitContext.Provider value={value}>{children}</SplitContext.Provider>
}

export function useSplit(): SplitApi {
  const v = useContext(SplitContext)
  if (!v) throw new Error('useSplit must be used within a SplitProvider')
  return v
}
