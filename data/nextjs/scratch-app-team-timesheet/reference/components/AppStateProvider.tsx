'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Day, Entry, Project, Route, Theme } from '../lib/types'

type LogHoursInput = {
  projectId: string
  day: Day
  hours: number
}

type AppApi = {
  projects: Project[]
  entries: Entry[]
  theme: Theme
  route: Route
  logHours: (input: LogHoursInput) => void
  submitEntry: (id: string) => void
  submitAll: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Alpha' },
  { id: 'p2', name: 'Bravo' },
  { id: 'p3', name: 'Carol' },
]

const SEED_ENTRIES: Entry[] = [
  { id: 'h1', projectId: 'p1', day: 'mon', hours: 4, submitted: false },
  { id: 'h2', projectId: 'p1', day: 'tue', hours: 3, submitted: false },
  { id: 'h3', projectId: 'p2', day: 'mon', hours: 5, submitted: true },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [projects] = useState<Project[]>(SEED_PROJECTS)
  const [entries, setEntries] = useState<Entry[]>(SEED_ENTRIES)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('week')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<AppApi>(() => {
    const logHours = (input: LogHoursInput) => {
      const id = `h${nextId}`
      setNextId((n) => n + 1)
      setEntries((prev) => [
        ...prev,
        {
          id,
          projectId: input.projectId,
          day: input.day,
          hours: input.hours < 0 ? 0 : input.hours,
          submitted: false,
        },
      ])
    }

    const submitEntry = (id: string) => {
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, submitted: true } : e)))
    }

    const submitAll = () => {
      setEntries((prev) => prev.map((e) => ({ ...e, submitted: true })))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      projects,
      entries,
      theme,
      route,
      logHours,
      submitEntry,
      submitAll,
      setTheme,
      navigate,
    }
  }, [projects, entries, theme, route, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
