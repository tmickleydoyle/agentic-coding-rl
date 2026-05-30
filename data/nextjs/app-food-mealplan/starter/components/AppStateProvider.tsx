'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Assignment, Day, Recipe, Route, Theme } from '../lib/types'

type PlanApi = {
  recipes: Recipe[]
  assignments: Assignment[]
  theme: Theme
  route: Route
  selectedDay: Day
  assign: (day: Day, recipeId: string) => void
  unassign: (id: string) => void
  selectDay: (day: Day) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PlanContext = createContext<PlanApi | null>(null)

const STUB: PlanApi = {
  recipes: [],
  assignments: [],
  theme: 'light',
  route: 'week',
  selectedDay: 'Mon',
  assign: () => {},
  unassign: () => {},
  selectDay: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold recipes/assignments/theme/route/selectedDay in state (seed 3 recipes + 2
  // assignments), implement the actions, and provide them through PlanContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <PlanContext.Provider value={STUB}>{children}</PlanContext.Provider>
}

export function usePlan(): PlanApi {
  const v = useContext(PlanContext)
  if (!v) throw new Error('usePlan must be used within an AppStateProvider')
  return v
}
