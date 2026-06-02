'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Status, Task } from '../lib/types'

const ORDER: Status[] = ['todo', 'doing', 'done']

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string, points: number) => void
  cycleStatus: (id: number) => void
  deleteTask: (id: number) => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(title: string, points: number) {
    const t = title.trim()
    if (!t || points <= 0) return
    setTasks((ts) => [...ts, { id: nextId, title: t, status: 'todo', points }])
    setNextId((n) => n + 1)
  }

  function cycleStatus(id: number) {
    setTasks((ts) =>
      ts.map((t) => {
        if (t.id !== id) return t
        const idx = (ORDER.indexOf(t.status) + 1) % ORDER.length
        return { ...t, status: ORDER[idx] }
      }),
    )
  }

  function deleteTask(id: number) {
    setTasks((ts) => ts.filter((t) => t.id !== id))
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    navigate: setRoute,
    addTask,
    cycleStatus,
    deleteTask,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setTasks([]),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
