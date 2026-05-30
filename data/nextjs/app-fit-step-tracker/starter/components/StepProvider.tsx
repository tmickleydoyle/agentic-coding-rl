'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Route, StepEntry, Theme } from '../lib/types'

type StepApi = {
  entries: StepEntry[]
  goal: number
  theme: Theme
  route: Route
  today: string
  logSteps: (input: { date: string; steps: number }) => void
  removeEntry: (id: string) => void
  setGoal: (value: number) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const StepContext = createContext<StepApi | null>(null)

const STUB: StepApi = {
  entries: [],
  goal: 10000,
  theme: 'light',
  route: 'today',
  today: '2026-05-28',
  logSteps: () => {},
  removeEntry: () => {},
  setGoal: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function StepProvider({ children }: { children: ReactNode }) {
  // TODO: hold entries/goal/theme/route/today in state (seed 3 entries, goal 10000),
  // implement logSteps (upsert by date), removeEntry, setGoal, navigate, and provide them
  // through StepContext. The STUB below makes the app mount but does nothing.
  return <StepContext.Provider value={STUB}>{children}</StepContext.Provider>
}

export function useStep(): StepApi {
  const v = useContext(StepContext)
  if (!v) throw new Error('useStep must be used within a StepProvider')
  return v
}
