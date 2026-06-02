'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Status, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, points: string) => void
  deleteTask: (id: number) => void
  setStatus: (id: number, status: Status) => void
  toggleTheme: () => void
  clearAll: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, points: string) {
    const n = name.trim()
    if (!n) return
    const p = parseInt(points, 10)
    const pts = isNaN(p) ? 0 : p
    setTasks((ts) => [...ts, { id: nextId, name: n, points: pts, status: 'todo' }])
    setNextId((id) => id + 1)
  }

  function deleteTask(id: number) {
    setTasks((ts) => ts.filter((t) => t.id !== id))
  }

  function setStatus(id: number, status: Status) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    navigate: setRoute,
    addTask,
    deleteTask,
    setStatus,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    clearAll: () => setTasks([]),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
