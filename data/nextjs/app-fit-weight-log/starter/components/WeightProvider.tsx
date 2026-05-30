'use client'
import { createContext, useContext, type ReactNode } from 'react'
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

const STUB: WeightApi = {
  entries: [],
  goal: 75,
  theme: 'light',
  route: 'log',
  addEntry: () => {},
  removeEntry: () => {},
  setGoal: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function WeightProvider({ children }: { children: ReactNode }) {
  // TODO: hold entries/goal/theme/route in state (seed 3 entries, goal 75), implement
  // addEntry/removeEntry/setGoal/navigate, and provide them through WeightContext. The
  // STUB below makes the app mount but does nothing.
  return <WeightContext.Provider value={STUB}>{children}</WeightContext.Provider>
}

export function useWeight(): WeightApi {
  const v = useContext(WeightContext)
  if (!v) throw new Error('useWeight must be used within a WeightProvider')
  return v
}
