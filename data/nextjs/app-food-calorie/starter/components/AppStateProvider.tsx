'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Goal, Meal, Route, Theme } from '../lib/types'

export const TODAY = '2026-05-29'

type NewMealInput = {
  name: string
  date?: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

type AppApi = {
  meals: Meal[]
  goal: Goal
  theme: Theme
  route: Route
  today: string
  addMeal: (input: NewMealInput) => void
  removeMeal: (id: string) => void
  setGoal: (goal: Goal) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  meals: [],
  goal: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  theme: 'light',
  route: 'today',
  today: TODAY,
  addMeal: () => {},
  removeMeal: () => {},
  setGoal: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold meals/goal/theme/route in state (seed 3 meals + a goal), implement actions,
  // and provide them through AppContext. Replace STUB with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
