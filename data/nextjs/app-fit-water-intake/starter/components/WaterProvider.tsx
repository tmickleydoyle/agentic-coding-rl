'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Drink, Route, Theme } from '../lib/types'

type WaterApi = {
  drinks: Drink[]
  goal: number
  reminders: number
  theme: Theme
  route: Route
  today: string
  addDrink: (input: { amount: number; date?: string }) => void
  removeDrink: (id: string) => void
  setGoal: (value: number) => void
  setReminders: (value: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const WaterContext = createContext<WaterApi | null>(null)

const STUB: WaterApi = {
  drinks: [],
  goal: 2000,
  reminders: 4,
  theme: 'light',
  route: 'today',
  today: '2026-05-28',
  addDrink: () => {},
  removeDrink: () => {},
  setGoal: () => {},
  setReminders: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function WaterProvider({ children }: { children: ReactNode }) {
  // TODO: hold drinks/goal/reminders/theme/route/today in state (seed 3 drinks, goal 2000,
  // reminders 4), implement addDrink/removeDrink/setGoal/setReminders/setTheme/navigate, and
  // provide them through WaterContext. The STUB below makes the app mount but does nothing.
  return <WaterContext.Provider value={STUB}>{children}</WaterContext.Provider>
}

export function useWater(): WaterApi {
  const v = useContext(WaterContext)
  if (!v) throw new Error('useWater must be used within a WaterProvider')
  return v
}
