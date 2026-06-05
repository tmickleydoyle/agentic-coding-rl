'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Route, Status, Task } from '../lib/types'

type Ctx = {
  tasks: Task[]
  theme: 'light' | 'dark'
  hideDone: boolean
  route: Route
  navigate: (r: Route) => void
  addTask: (title: string, points: number) => void
  setStatus: (id: number, status: Status) => void
  deleteTask: (id: number) => void
  toggleTheme: () => void
  toggleHideDone: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideDone, setHideDone] = useState(false)
  const [route, setRoute] = useState<Route>('board')
  const [nextId, setNextId] = useState(1)

  function addTask(title: string, points: number) {
    const t = title.trim()
    if (!t) return
    const pts = Number.isInteger(points) && points > 0 ? points : 1
    setTasks((prev) => [...prev, { id: nextId, title: t, points: pts, status: 'todo' }])
    setNextId((n) => n + 1)
  }

  function setStatus(id: number, status: Status) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const value: Ctx = {
    tasks,
    theme,
    hideDone,
    route,
    navigate: setRoute,
    addTask,
    setStatus,
    deleteTask,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideDone: () => setHideDone((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
