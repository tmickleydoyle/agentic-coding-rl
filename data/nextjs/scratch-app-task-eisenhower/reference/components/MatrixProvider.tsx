'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Quadrant, Route, Task, Theme } from '../lib/types'
import { quadrantFlags } from '../lib/types'

type NewTaskInput = { title: string; urgent: boolean; important: boolean }

type MatrixApi = {
  tasks: Task[]
  theme: Theme
  route: Route
  addTask: (input: NewTaskInput) => void
  moveTo: (id: string, quadrant: Quadrant) => void
  toggleUrgent: (id: string) => void
  toggleImportant: (id: string) => void
  removeTask: (id: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const MatrixContext = createContext<MatrixApi | null>(null)

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Fix outage', urgent: true, important: true },
  { id: 't2', title: 'Plan roadmap', urgent: false, important: true },
  { id: 't3', title: 'Answer emails', urgent: true, important: false },
  { id: 't4', title: 'Browse forums', urgent: false, important: false },
]

export function MatrixProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('matrix')
  const [nextId, setNextId] = useState(5)

  const value = useMemo<MatrixApi>(() => {
    const addTask = (input: NewTaskInput) => {
      const trimmed = input.title.trim()
      if (trimmed.length === 0) return
      const id = `t${nextId}`
      setNextId((n) => n + 1)
      setTasks((prev) => [
        ...prev,
        { id, title: trimmed, urgent: input.urgent, important: input.important },
      ])
    }

    const moveTo = (id: string, quadrant: Quadrant) => {
      const flags = quadrantFlags(quadrant)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, urgent: flags.urgent, important: flags.important } : t,
        ),
      )
    }

    const toggleUrgent = (id: string) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, urgent: !t.urgent } : t)))
    }

    const toggleImportant = (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, important: !t.important } : t)),
      )
    }

    const removeTask = (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      tasks,
      theme,
      route,
      addTask,
      moveTo,
      toggleUrgent,
      toggleImportant,
      removeTask,
      setTheme,
      navigate,
    }
  }, [tasks, theme, route, nextId])

  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
}

export function useMatrix(): MatrixApi {
  const v = useContext(MatrixContext)
  if (!v) throw new Error('useMatrix must be used within a MatrixProvider')
  return v
}
