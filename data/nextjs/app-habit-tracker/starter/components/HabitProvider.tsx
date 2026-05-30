'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Habit, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type HabitApi = {
  habits: Habit[]
  theme: Theme
  route: Route
  today: string
  toggleToday: (id: string) => void
  addHabit: (name: string) => void
  removeHabit: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const HabitContext = createContext<HabitApi | null>(null)

const STUB: HabitApi = {
  habits: [],
  theme: 'light',
  route: 'today',
  today: TODAY,
  toggleToday: () => {},
  addHabit: () => {},
  removeHabit: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function HabitProvider({ children }: { children: ReactNode }) {
  // TODO: hold habits/theme/route/today in state (seed 3 habits), implement toggleToday
  // (toggle today's date in a habit's history), addHabit (id h4, h5, …), removeHabit, and
  // navigate. The STUB below makes the app mount but does nothing.
  return <HabitContext.Provider value={STUB}>{children}</HabitContext.Provider>
}

export function useHabits(): HabitApi {
  const v = useContext(HabitContext)
  if (!v) throw new Error('useHabits must be used within a HabitProvider')
  return v
}
