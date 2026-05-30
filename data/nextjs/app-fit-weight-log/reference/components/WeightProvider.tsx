'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Theme, WeightEntry } from '../lib/types'

type WeightApi = {
  entries: WeightEntry[]
  goal: number
  theme: Theme
  route: Route
  addEntry: (input: { date: string; weight: number }) => void
  removeEntry: (id: string) => void
  setGoal: (value: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const WeightContext = createContext<WeightApi | null>(null)

const SEED_ENTRIES: WeightEntry[] = [
  { id: 'g1', date: '2026-05-01', weight: 80 },
  { id: 'g2', date: '2026-05-08', weight: 79.5 },
  { id: 'g3', date: '2026-05-15', weight: 79 },
]

export function WeightProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WeightEntry[]>(SEED_ENTRIES)
  const [goal, setGoal] = useState(75)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('log')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<WeightApi>(() => {
    const addEntry = (input: { date: string; weight: number }) => {
      const id = `g${nextId}`
      setNextId((n) => n + 1)
      setEntries((prev) => [...prev, { id, date: input.date, weight: input.weight }])
    }

    const removeEntry = (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      entries,
      goal,
      theme,
      route,
      addEntry,
      removeEntry,
      setGoal,
      setTheme,
      navigate,
    }
  }, [entries, goal, theme, route, nextId])

  return <WeightContext.Provider value={value}>{children}</WeightContext.Provider>
}

export function useWeight(): WeightApi {
  const v = useContext(WeightContext)
  if (!v) throw new Error('useWeight must be used within a WeightProvider')
  return v
}
