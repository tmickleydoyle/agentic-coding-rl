'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Status, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, points: number) => void
  startTask: (id: number) => void
  completeTask: (id: number) => void
  deleteTask: (id: number) => void
  toggleTheme: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, points: number) {
    const n = name.trim()
    if (!n || points <= 0) return
    setTasks((ts) => [...ts, { id: nextId, name: n, points, status: 'todo' }])
    setNextId((i) => i + 1)
  }

  function startTask(id: number) {
    setTasks((ts) =>
      ts.map((t) => (t.id === id && t.status === 'todo' ? { ...t, status: 'doing' as Status } : t)),
    )
  }

  function completeTask(id: number) {
    setTasks((ts) =>
      ts.map((t) => (t.id === id && t.status === 'doing' ? { ...t, status: 'done' as Status } : t)),
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
    startTask,
    completeTask,
    deleteTask,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
