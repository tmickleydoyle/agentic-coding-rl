'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Task, Status, Route } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  route: Route
  navigate: (r: Route) => void
  addTask: (name: string, points: number) => void
  updateStatus: (id: number, status: Status) => void
  deleteTask: (id: number) => void
  clearAll: () => void
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
    if (!n) return
    const pts = Number.isFinite(points) && points >= 1 ? Math.round(points) : 1
    setTasks((ts) => [...ts, { id: nextId, name: n, points: pts, status: 'todo' }])
    setNextId((x) => x + 1)
  }

  function updateStatus(id: number, status: Status) {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function deleteTask(id: number) {
    setTasks((ts) => ts.filter((t) => t.id !== id))
  }

  function clearAll() {
    setTasks([])
  }

  const value: Ctx = {
    tasks,
    theme,
    route,
    navigate: setRoute,
    addTask,
    updateStatus,
    deleteTask,
    clearAll,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
