'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Goal, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'

type GoalApi = {
  goals: Goal[]
  theme: Theme
  route: Route
  today: string
  selectedId: string | null
  selectGoal: (id: string) => void
  toggleMilestone: (goalId: string, milestoneId: string) => void
  addGoal: (input: { name: string; targetDate: string }) => void
  removeGoal: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const GoalContext = createContext<GoalApi | null>(null)

const STUB: GoalApi = {
  goals: [],
  theme: 'light',
  route: 'goals',
  today: TODAY,
  selectedId: null,
  selectGoal: () => {},
  toggleMilestone: () => {},
  addGoal: () => {},
  removeGoal: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function GoalProvider({ children }: { children: ReactNode }) {
  // TODO: hold goals/theme/route/today/selectedId in state (seed 2 goals), implement
  // selectGoal (set selection + navigate to goal-detail), toggleMilestone, addGoal
  // (id g3, … with one seeded milestone), removeGoal, navigate. The STUB makes the app
  // mount but does nothing.
  return <GoalContext.Provider value={STUB}>{children}</GoalContext.Provider>
}

export function useGoals(): GoalApi {
  const v = useContext(GoalContext)
  if (!v) throw new Error('useGoals must be used within a GoalProvider')
  return v
}
