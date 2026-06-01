'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Hire, OnboardTask, Route, Theme } from '../lib/types'

type AppApi = {
  hires: Hire[]
  tasks: OnboardTask[]
  theme: Theme
  route: Route
  selectedHireId: string | null
  toggleTask: (taskId: string) => void
  setTaskDone: (taskId: string, done: boolean) => void
  addTask: (input: { hireId: string; label: string }) => void
  selectHire: (hireId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_HIRES: Hire[] = [
  { id: 'h1', name: 'Ada', role: 'Engineer', startDate: '2026-06-01' },
  { id: 'h2', name: 'Grace', role: 'Designer', startDate: '2026-06-15' },
  { id: 'h3', name: 'Linus', role: 'Manager', startDate: '2026-07-01' },
]

const SEED_TASKS: OnboardTask[] = [
  { id: 't1', hireId: 'h1', label: 'Sign contract', done: true },
  { id: 't2', hireId: 'h1', label: 'Setup laptop', done: true },
  { id: 't3', hireId: 'h1', label: 'Meet team', done: false },
  { id: 't4', hireId: 'h1', label: 'Read handbook', done: false },
  { id: 't5', hireId: 'h2', label: 'Sign contract', done: true },
  { id: 't6', hireId: 'h2', label: 'Setup laptop', done: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hires] = useState<Hire[]>(SEED_HIRES)
  const [tasks, setTasks] = useState<OnboardTask[]>(SEED_TASKS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('hires')
  const [selectedHireId, setSelectedHireId] = useState<string | null>(null)
  const [nextId, setNextId] = useState(7)

  const value = useMemo<AppApi>(() => {
    const toggleTask = (taskId: string) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)))
    }

    const setTaskDone = (taskId: string, done: boolean) => {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, done } : t)))
    }

    const addTask = (input: { hireId: string; label: string }) => {
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setTasks((prev) => [...prev, { id, hireId: input.hireId, label: input.label, done: false }])
    }

    const selectHire = (hireId: string) => {
      setSelectedHireId(hireId)
      setRoute('hire-detail')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      hires,
      tasks,
      theme,
      route,
      selectedHireId,
      toggleTask,
      setTaskDone,
      addTask,
      selectHire,
      setTheme,
      navigate,
    }
  }, [hires, tasks, theme, route, selectedHireId, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}
