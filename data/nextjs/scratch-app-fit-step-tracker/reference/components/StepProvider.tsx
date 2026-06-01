'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
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

const SEED_ENTRIES: StepEntry[] = [
  { id: 's1', date: '2026-05-25', steps: 12000 },
  { id: 's2', date: '2026-05-26', steps: 8000 },
  { id: 's3', date: '2026-05-27', steps: 11000 },
]

export function StepProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<StepEntry[]>(SEED_ENTRIES)
  const [goal, setGoal] = useState(10000)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('today')
  const [today] = useState('2026-05-28')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<StepApi>(() => {
    const logSteps = (input: { date: string; steps: number }) => {
      setEntries((prev) => {
        const existing = prev.find((e) => e.date === input.date)
        if (existing) {
          return prev.map((e) =>
            e.date === input.date ? { ...e, steps: input.steps } : e,
          )
        }
        const id = `s${nextId}`
        setNextId((n) => n + 1)
        return [...prev, { id, date: input.date, steps: input.steps }]
      })
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
      today,
      logSteps,
      removeEntry,
      setGoal,
      setTheme,
      navigate,
    }
  }, [entries, goal, theme, route, today, nextId])

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>
}

export function useStep(): StepApi {
  const v = useContext(StepContext)
  if (!v) throw new Error('useStep must be used within a StepProvider')
  return v
}
