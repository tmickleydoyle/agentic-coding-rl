'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Task, Theme } from '../lib/types'

type PomodoroApi = {
  tasks: Task[]
  theme: Theme
  route: Route
  selectedId: string | null
  addTask: (title: string) => void
  removeTask: (id: string) => void
  toggleDone: (id: string) => void
  selectTask: (id: string | null) => void
  completeSession: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const PomodoroContext = createContext<PomodoroApi | null>(null)

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Write report', sessions: 2, done: false },
  { id: 't2', title: 'Review PR', sessions: 0, done: false },
  { id: 't3', title: 'Plan sprint', sessions: 1, done: true },
]

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('tasks')
  const [selectedId, setSelectedId] = useState<string | null>('t1')
  const [nextId, setNextId] = useState(4)

  const value = useMemo<PomodoroApi>(() => {
    const addTask = (title: string) => {
      const trimmed = title.trim()
      if (trimmed.length === 0) return
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setTasks((prev) => [...prev, { id, title: trimmed, sessions: 0, done: false }])
    }

    const removeTask = (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setSelectedId((cur) => (cur === id ? null : cur))
    }

    const toggleDone = (id: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    }

    const selectTask = (id: string | null) => setSelectedId(id)

    const completeSession = (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, sessions: t.sessions + 1 } : t)),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tasks,
      theme,
      route,
      selectedId,
      addTask,
      removeTask,
      toggleDone,
      selectTask,
      completeSession,
      setTheme,
      navigate,
    }
  }, [tasks, theme, route, selectedId, nextId])

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro(): PomodoroApi {
  const v = useContext(PomodoroContext)
  if (!v) throw new Error('usePomodoro must be used within a PomodoroProvider')
  return v
}
