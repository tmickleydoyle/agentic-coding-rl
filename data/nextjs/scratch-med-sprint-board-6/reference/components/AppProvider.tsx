'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Task, Route } from '../lib/types'

type Ctx = {
  tasks: Task[]
  route: Route
  theme: 'light' | 'dark'
  hideDone: boolean
  navigate: (r: Route) => void
  addTask: (name: string, points: number) => void
  startTask: (id: number) => void
  finishTask: (id: number) => void
  clearDone: () => void
  toggleTheme: () => void
  toggleHideDone: () => void
}

export const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [route, setRoute] = useState<Route>('board')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [hideDone, setHideDone] = useState(false)
  const [nextId, setNextId] = useState(1)

  function addTask(name: string, points: number) {
    const n = name.trim()
    if (!n) return
    const p = points < 1 ? 1 : Math.round(points)
    setTasks((ts) => [...ts, { id: nextId, name: n, points: p, status: 'todo' }])
    setNextId((id) => id + 1)
  }

  function startTask(id: number) {
    setTasks((ts) => ts.map((t) => (t.id === id && t.status === 'todo' ? { ...t, status: 'doing' } : t)))
  }

  function finishTask(id: number) {
    setTasks((ts) => ts.map((t) => (t.id === id && t.status === 'doing' ? { ...t, status: 'done' } : t)))
  }

  function clearDone() {
    setTasks((ts) => ts.filter((t) => t.status !== 'done'))
  }

  const value: Ctx = {
    tasks,
    route,
    theme,
    hideDone,
    navigate: setRoute,
    addTask,
    startTask,
    finishTask,
    clearDone,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toggleHideDone: () => setHideDone((h) => !h),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
